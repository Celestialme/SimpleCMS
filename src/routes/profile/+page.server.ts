import { redirect, type Actions } from '@sveltejs/kit';
import { auth } from '../api/db';
import { validate } from '@src/utils/utils';
import { superValidate } from 'sveltekit-superforms/server';
import { addUserSchema, changePasswordSchema } from '@src/utils/formSchemas';
import { passwordToken } from '@lucia-auth/tokens';
import { SESSION_COOKIE_NAME } from 'lucia-auth';
import type { User } from '@src/collections/Auth';

export async function load(event) {
	let session = event.cookies.get(SESSION_COOKIE_NAME) as string;
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
		let addUserForm = await superValidate(event, addUserSchema);
		let email = addUserForm.data.email;
		let role = addUserForm.data.role;
		let key = await auth.getKey('email', email).catch(() => null);

		if (key) return { form: addUserForm, message: 'This email is already registered' };

		let user: User = await auth
			.createUser({
				primaryKey: {
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
		const tokenHandler = passwordToken(auth as any, 'register', {
			expiresIn: 60 * 60, // expiration in 1 hour,
			length: 16 // default
		});
		let token = (await tokenHandler.issue(user.id)).toString();
		console.log(token); // send token to user via email
		return { form: addUserForm };
	},
	changePassword: async (event) => {
		let changePasswordForm = await superValidate(event, changePasswordSchema);
		let password = changePasswordForm.data.password;
		let session = event.cookies.get(SESSION_COOKIE_NAME) as string;
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
