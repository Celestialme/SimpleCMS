import { redirect, type Actions } from '@sveltejs/kit';
import { auth } from '../api/db';
import { addUserSchema, changePasswordSchema } from '@src/utils/formSchemas';
import { fail } from '@sveltejs/kit';
import { SESSION_COOKIE_NAME } from '@src/auth';
import type { Roles } from '@src/auth/types';
export async function load(event) {
	let session_id = event.cookies.get(SESSION_COOKIE_NAME) as string;
	let user = await auth.validateSession(session_id);
	if (user) {
		return {
			user
		};
	} else {
		redirect(302, `/login`);
	}
}

export const actions: Actions = {
	addUser: async ({ request, cookies }) => {
		let session_id = cookies.get(SESSION_COOKIE_NAME) as string;
		let user = await auth.validateSession(session_id);
		let data = await request.formData();
		let form = addUserSchema.safeParse(Object.fromEntries(data));
		if (!form.success) return fail(400, { message: 'invalid form members' });
		if (!user || user.role != 'admin') {
			return fail(400, { message: 'you dont have permission to add user' });
		}
		let email = form.data.email;
		let role = form.data.role as Roles;
		if (await auth.checkUser({ email })) {
			return fail(400, { message: 'user already exists' });
		}
		let newUser = await auth.createUser({
			email,
			role,
			lastAuthMethod: 'password',
			is_registered: false
		});

		if (!newUser) return fail(400, { message: 'unknown error' });

		let token = await auth.createToken(newUser.id, 60 * 60 * 1000);
		console.log(token); // send token to user via email
		return { message: 'user has been added successfully' };
	},
	changePassword: async ({ request, cookies }) => {
		let data = await request.formData();
		let form = changePasswordSchema.safeParse(Object.fromEntries(data));
		if (!form.success) return fail(400, { message: 'invalid form members' });

		let password = form.data.password;
		let session_id = cookies.get(SESSION_COOKIE_NAME) as string;
		let user = await auth.validateSession(session_id);
		if (!user) return { message: 'user does not exist or session expired' };
		await auth.updateUserAttributes(user, { password: password, lastAuthMethod: 'password' });

		return { message: 'password changed successfully' };
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
