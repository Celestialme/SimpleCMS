import { redirect, type Actions } from '@sveltejs/kit';
import { auth } from '../api/db';
import { validate } from '@src/utils/utils';
import { superValidate } from 'sveltekit-superforms/server';
import { addUserTokenSchema, changePasswordSchema } from '@src/utils/formSchemas';
import { passwordToken } from '@lucia-auth/tokens';
import { SESSION_COOKIE_NAME } from 'lucia-auth';
import type { User } from '@src/collections/Auth';

// This function loads the data for the page.
export async function load(event) {
	// Get the current user's session.
	let session = event.cookies.get(SESSION_COOKIE_NAME) as string;

	// Validate the user's session.
	let user = await validate(auth, session);

	// Validate the form data.
	let addUserForm = await superValidate(event, addUserTokenSchema);
	let changePasswordForm = await superValidate(event, changePasswordSchema);

	// If the user is logged in, return the data for the page.
	if (user.status == 200) {
		return {
			user: user.user,
			addUserForm,
			changePasswordForm
		};
	} else {
		// If the user is not logged in, redirect them to the login page.
		throw redirect(302, `/login`);
	}
}

export const actions: Actions = {
	// This action adds a new user to the system.
	addUser: async (event) => {
		let addUserForm = await superValidate(event, addUserTokenSchema);
		let email = addUserForm.data.email;
		let role = addUserForm.data.role;
		let expiresIn = addUserForm.data.expiresIn;

		// Check if the email address is already registered.
		let key = await auth.getKey('email', email).catch(() => null);
		if (key) {
			// The email address is already registered.
			return { form: addUserForm, message: 'This email is already registered' };
		}

		// Create a new user.
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

		if (!user) {
			// An unknown error occurred.
			return { form: addUserForm, message: 'unknown error' };
		}

		// Calculate expiration time in seconds based on expiresIn value
		let expirationTime: any;
		switch (expiresIn) {
			case '2 hrs':
				expirationTime = 2 * 60 * 60;
				break;
			case '12 hrs':
				expirationTime = 12 * 60 * 60;
				break;
			case '2 days':
				expirationTime = 2 * 24 * 60 * 60;
				break;
			case '1 week':
				expirationTime = 7 * 24 * 60 * 60;
				break;
			default:
				// Handle invalid expiresIn value
				return { form: addUserForm, message: 'Invalid value for token validity' };
		}

		// Issue a token for the new user.
		const tokenHandler = passwordToken(auth as any, 'register', {
			expiresIn: expirationTime,
			length: 16 // default
		});

		let token = (await tokenHandler.issue(user.id)).toString();

		// TODO: Add svelte email
		// Send the token to the user via email.
		console.log(token);

		return { form: addUserForm };
	},

	// This action changes the password for the current user.
	changePassword: async (event) => {
		// Validate the form data.
		let changePasswordForm = await superValidate(event, changePasswordSchema);
		let password = changePasswordForm.data.password;
		let session = event.cookies.get(SESSION_COOKIE_NAME) as string;
		let user = await validate(auth, session);

		// The user's session is invalid.
		if (user.status != 200) {
			return { form: changePasswordForm, message: 'User does not exist or session expired' };
		}

		// Get the user's key.
		const key = (await auth.getAllUserKeys(user.user.id)).find((key) => key.passwordDefined == true);
		if (!key) return { form: changePasswordForm, message: 'user does not exist or session expired' };

		// Update the user's key password.
		await auth.updateKeyPassword('email', key.providerUserId, password);

		// Update the user's authentication method.
		let authMethod = 'password';
		await auth.updateUserAttributes(key.userId, { authMethod });

		// Return the form data.
		return { form: changePasswordForm };
	}
};
