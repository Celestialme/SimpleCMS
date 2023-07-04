import { redirect, type Actions } from '@sveltejs/kit';
import { auth } from '@src/routes/api/db.js';
import { validate } from '@src/utils/utils';
import { superValidate } from 'sveltekit-superforms/server';
import { addUserSchema, changePasswordSchema } from '@src/utils/formSchemas';
import { passwordToken } from '@lucia-auth/tokens';
import { SESSION_COOKIE_NAME } from 'lucia-auth';
import type { User } from '@src/collections/Auth';

//import { LuciaError } from 'lucia-auth';

// Load function to check if user is authenticated
export async function load(event) {
	// Get session data from cookies
	let session = event.cookies.get(SESSION_COOKIE_NAME) as string;
	// Validate session
	let user = await validate(auth, session);
	// Validate addUserForm data
	let addUserForm = await superValidate(event, addUserSchema);
	let changePasswordForm = await superValidate(event, changePasswordSchema);

	// If user is authenticated
	if (user.status == 200) {
		return {
			user: user.user,
			addUserForm,
			changePasswordForm
		};
	} else {
		// Redirect to login page if not authenticated
		throw redirect(302, `/login`);
	}
}

// Actions object containing addUser function
export const actions: Actions = {
	addUser: async (event) => {
		// Validate addUserForm data
		let addUserForm = await superValidate(event, addUserSchema);
		let email = addUserForm.data.email;
		let role = addUserForm.data.role;
		// Check if email is already registered
		let key = await auth.getKey('email', email).catch(() => null);
		// If email is already registered
		if (key) return { form: addUserForm, message: 'This email is already registered' };

		// Create new user with provided email and role
		let user = await auth
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
		// Issue password token for new user
		//TODO: get data from User Modal
		const tokenHandler = passwordToken(auth as any, 'register', {
			expiresIn: 60 * 60, // expiration in 1 hour,
			length: 43 // default
		});

		// Issue password token for new user
		let token = (await tokenHandler.issue(user.id)).toString();
		console.log(token); // send token to user via email
		return { form: addUserForm };
	},
	changePassword: async (event) => {
		let changePasswordForm = await superValidate(event, changePasswordSchema);
		let password = changePasswordForm.data.password;
		let session = event.cookies.get(SESSION_COOKIE_NAME) as string;
		let user = await validate(auth, session);
		let authMethod = 'password';

		if (user.status != 200) return { form: changePasswordForm, message: 'user does not exist or session expired' };

		const key = (await auth.getAllUserKeys(user.user.id)).find((key) => key.passwordDefined == true);

		if (!key) return { form: changePasswordForm, message: 'user does not exist or session expired' };

		await auth.updateKeyPassword('email', key.providerUserId, password);
		await auth.updateUserAttributes(key.userId, { authMethod });

		return { form: changePasswordForm };
	}
};
