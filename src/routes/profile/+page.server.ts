import { redirect, type Actions } from '@sveltejs/kit';
import { auth } from '../api/db';
import { superValidate } from 'sveltekit-superforms/server';
import { addUserSchema, changePasswordSchema } from '@src/utils/formSchemas';
import { fail } from '@sveltejs/kit';
import { SESSION_COOKIE_NAME } from '@src/auth';
import type { Roles, User } from '@src/auth/types';
export async function load(event) {
	let session_id = event.cookies.get(SESSION_COOKIE_NAME) as string;
	let user = await auth.validateSession(session_id);
	let addUserForm = await superValidate(event, addUserSchema);
	let changePasswordForm = await superValidate(event, changePasswordSchema);
	if (user) {
		return {
			user,
			addUserForm,
			changePasswordForm
		};
	} else {
		throw redirect(302, `/login`);
	}
}

export const actions: Actions = {
	addUser: async (event) => {
		let session_id = event.cookies.get(SESSION_COOKIE_NAME) as string;
		let user = await auth.validateSession(session_id);
		let addUserForm = await superValidate(event, addUserSchema);
		if (!user || user.role != 'admin') {
			return { form: addUserForm, message: 'you dont have permission to add user' };
		}
		let email = addUserForm.data.email;
		let role = addUserForm.data.role as Roles;
		let newUser = await auth.createUser({
			email,
			role,
			lastAuthMethod: 'password',
			is_registered: false
		});

		if (!newUser) return { form: addUserForm, message: 'unknown error' };

		let token = await auth.createToken(newUser.id, 60 * 60 * 1000);
		console.log(token); // send token to user via email
		return { form: addUserForm };
	},
	changePassword: async (event) => {
		let changePasswordForm = await superValidate(event, changePasswordSchema);
		let password = changePasswordForm.data.password;
		let session_id = event.cookies.get(SESSION_COOKIE_NAME) as string;
		let user = await auth.validateSession(session_id);
		if (!user) return { form: changePasswordForm, message: 'user does not exist or session expired' };
		await auth.updateUserAttributes(user, { password: password, lastAuthMethod: 'password' });

		return { form: changePasswordForm };
	},
	deleteUser: async (event) => {
		let session_id = event.cookies.get(SESSION_COOKIE_NAME) as string;
		let user = await auth.validateSession(session_id);
		if (!user || user.role != 'admin') {
			return fail(403);
		}
		let data = await event.request.formData();
		let ids = data.getAll('id');
		for (let id of ids) {
			auth.deleteUser(id as string);
		}
	},
	editUser: async (event) => {
		let session_id = event.cookies.get(SESSION_COOKIE_NAME) as string;
		let user = await auth.validateSession(session_id);
		if (!user || user.role != 'admin') {
			return fail(403);
		}
		let data = await event.request.formData();
		let infos = data.getAll('info');

		for (let info_json of infos) {
			let info = JSON.parse(info_json as string) as { id: string; field: 'email' | 'role' | 'name'; value: string };

			let user = await auth.checkUser({ id: info.id });
			console.log(user);
			user &&
				auth.updateUserAttributes(user, {
					[info.field]: info.value
				});
		}
	}
};
