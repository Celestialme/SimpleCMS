import { redirect, type Actions } from '@sveltejs/kit';
import { auth } from '../api/db';
import { addUserSchema, changePasswordSchema } from '@src/utils/formSchemas';
import { fail } from '@sveltejs/kit';
import type { Roles } from '@src/auth/types';
export async function load(event) {
	let user = event.locals.user;
	return {
		user
	};
}

export const actions: Actions = {
	addUser: async ({ request, locals }) => {
		let user = locals.user;
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
	changePassword: async ({ request, locals }) => {
		let data = await request.formData();
		let form = changePasswordSchema.safeParse(Object.fromEntries(data));
		if (!form.success) return fail(400, { message: 'invalid form members' });

		let password = form.data.password;
		let user = locals.user;
		if (!user) return { message: 'user does not exist or session expired' };
		let res = await auth.updateUserAttributes(user, {
			password: password,
			lastAuthMethod: 'password'
		});

		return { message: 'password changed successfully' };
	},
	deleteUser: async (event) => {
		let user = event.locals.user;
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
		let user = event.locals.user;
		if (user.role != 'admin') {
			return fail(403);
		}
		let data = await event.request.formData();
		let infos = data.getAll('info');

		for (let info_json of infos) {
			let info = JSON.parse(info_json as string) as {
				id: string;
				field: 'email' | 'role' | 'name';
				value: string;
			};

			let user = await auth.checkUser({ _id: info.id });

			user &&
				auth.updateUserAttributes(user, {
					[info.field]: info.value
				});
		}
	}
};
