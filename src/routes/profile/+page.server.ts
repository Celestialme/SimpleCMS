import { redirect, type Actions } from '@sveltejs/kit';
import { auth } from '../api/db';
import { validate } from '@src/utils/utils';
import { superValidate } from 'sveltekit-superforms/server';
import { addUserSchema, changePasswordSchema } from '@src/utils/formSchemas';
import { createToken } from '@src/utils/tokens';
import { DEFAULT_SESSION_COOKIE_NAME } from 'lucia';
import type { User } from '@src/collections/Auth';
export async function load(event) {
	let session = event.cookies.get(DEFAULT_SESSION_COOKIE_NAME) as string;
	let user = await validate(auth, session);
	let addUserForm = await superValidate(event, addUserSchema);
	let changePasswordForm = await superValidate(event, changePasswordSchema);
	if (user.status == 200) {
		return {
			user: user.user,
			addUserForm,
			changePasswordForm
		};
	} else {
		throw redirect(302, `/login`);
	}
}

export const actions: Actions = {
	addUser: async (event) => {
		let session = event.cookies.get(DEFAULT_SESSION_COOKIE_NAME) as string;
		let _user = await validate(auth, session);
		let addUserForm = await superValidate(event, addUserSchema);
		if (_user.status != 200 || _user.user.role != 'admin') {
			return { form: addUserForm, message: 'you dont have permission to add user' };
		}
		let email = addUserForm.data.email;
		let role = addUserForm.data.role;
		let key = await auth.getKey('email', email).catch(() => null);

		if (key) return { form: addUserForm, message: 'This email is already registered' };

		let user: User = await auth
			.createUser({
				key: {
					providerId: 'email',
					providerUserId: email,
					password: null
				},
				attributes: {
					username: null,
					role
				}
			})
			.catch((_) => null);
		if (!user) return { form: addUserForm, message: 'unknown error' };

		let token = await createToken(user.id, 60 * 60 * 1000);
		console.log(token); // send token to user via email
		return { form: addUserForm };
	},
	changePassword: async (event) => {
		let changePasswordForm = await superValidate(event, changePasswordSchema);
		let password = changePasswordForm.data.password;
		let session = event.cookies.get(DEFAULT_SESSION_COOKIE_NAME) as string;
		let user = await validate(auth, session);
		if (user.status != 200) return { form: changePasswordForm, message: 'user does not exist or session expired' };
		const key = (await auth.getAllUserKeys(user.user.id)).find((key) => key.passwordDefined == true);
		if (!key) return { form: changePasswordForm, message: 'user does not exist or session expired' };
		await auth.updateKeyPassword('email', key.providerUserId, password);
		let authMethod = 'password';
		await auth.updateUserAttributes(key.userId, { authMethod });

		return { form: changePasswordForm };
	}
};
