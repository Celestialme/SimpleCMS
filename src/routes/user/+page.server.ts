import { redirect, type Actions } from '@sveltejs/kit';
import { auth } from '../api/db';
import { validate } from '@src/utils/utils';
import { superValidate } from 'sveltekit-superforms/server';
import { addUserTokenSchema, changePasswordSchema } from '@src/utils/formSchemas';
import { passwordToken } from '@lucia-auth/tokens';
import { SESSION_COOKIE_NAME, type Key } from 'lucia-auth';
import mongoose from 'mongoose';
//import type { User } from '@src/collections/Auth';

// Load function to check if user is authenticated
export async function load(event) {
	let allUsers = await getAllUsers();
	let tokens = await getTokens();
	// Get session data from cookies
	const session = event.cookies.get(SESSION_COOKIE_NAME) as string;

	// Validate the user's session.
	const user = await validate(auth, session);

	// Validate addUserForm data
	const addUserForm = await superValidate(event, addUserTokenSchema);
	const changePasswordForm = await superValidate(event, changePasswordSchema);

	// If user is authenticated, return the data for the page.
	if (user.status == 200) {
		return {
			allUsers,
			tokens,
			user: user.user,
			addUserForm,
			changePasswordForm
		};
	} else {
		// If the user is not logged in, redirect them to the login page.
		throw redirect(302, `/login`);
	}
}

// This action adds a new user to the system.
export const actions: Actions = {
	addUser: async (event) => {
		// Validate addUserForm data
		const addUserForm = await superValidate(event, addUserTokenSchema);
		const email = addUserForm.data.email;
		const role = addUserForm.data.role;
		const expiresIn = addUserForm.data.expiresIn;

		// Check if the email address is already registered.
		const key = await auth.getKey('email', email).catch(() => null);
		if (key) {
			// The email address is already registered.
			return { form: addUserForm, message: 'This email is already registered' };
		}

		// Create new user with provided email and role
		const user = await auth
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
			.catch(() => null);

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
			length: 43 // default
		});

		// Issue password token for new user
		const token = (await tokenHandler.issue(user.id)).toString();

		// TODO: Add svelte email or on Forgotten form?
		// Send the token to the user via email.
		console.log('addUser', token);

		// send welcome email
		//TODO: port to utils not to expose ... remove fetch from backend
		await event.fetch('/api/sendMail', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: email,
				subject: 'ForgotPassword',
				message: 'ForgotPassword',
				templateName: 'ForgotPassword',
				props: {
					email: email,
					token: token
				}
			})
		});

		return { form: addUserForm };
	},

	// This action changes the password for the current user.
	changePassword: async (event) => {
		// Validate the form data.
		const changePasswordForm = await superValidate(event, changePasswordSchema);
		const password = changePasswordForm.data.password;
		const session = event.cookies.get(SESSION_COOKIE_NAME) as string;
		const user = await validate(auth, session);

		// The user's session is invalid.
		if (user.status != 200) {
			return { form: changePasswordForm, message: 'User does not exist or session expired' };
		}

		// Get the user's key.
		const key = (await auth.getAllUserKeys(user.user.id)).find(
			(key) => key.passwordDefined == true
		);
		if (!key)
			return { form: changePasswordForm, message: 'User does not exist or session expired' };

		// Update the user's key password.
		await auth.updateKeyPassword('email', key.providerUserId, password);

		// Update the user's authentication method.
		const authMethod = 'password';
		await auth.updateUserAttributes(key.userId, { authMethod });

		// Return the form data.
		return { form: changePasswordForm };
	}
};

async function getAllUsers() {
	const AUTH_KEY = mongoose.models['auth_key'];
	const keys = await AUTH_KEY.find({ primary_key: true });
	const users = [] as any;
	for (const key of keys) {
		const user = await auth.getUser(key['user_id']);
		user.email = key._id.split(':')[1];
		users.push(user);
	}
	return users;
}
async function getTokens() {
	const AUTH_KEY = mongoose.models['auth_key'];
	const tokens = await AUTH_KEY.find({ primary_key: false });
	const users = [] as any;
	for (const token of tokens) {
		const user = await auth.getUser(token['user_id']);
		user.email = token._id.split(':')[1];
		users.push(user);
	}
	return users;
}
