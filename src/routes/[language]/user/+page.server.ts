import { redirect, type Actions } from '@sveltejs/kit';
import { auth } from '@src/routes/api/db.js';
import { validate } from '@src/utils/utils';
import { superValidate } from 'sveltekit-superforms/server';
import { addUserSchema } from '@src/utils/formSchemas';
import { passwordToken } from '@lucia-auth/tokens';
import { LuciaError } from 'lucia-auth';

// Load function to check if user is authenticated
export async function load(event) {
	// Get session data from cookies
	let session = JSON.parse(event.cookies.get('credentials') || '{"username":null,"session":null}') as { username: string; session: string };
	// Validate session
	let user = await validate(auth, session.session);
	// Validate addUserForm data
	let addUserForm = await superValidate(event, addUserSchema);
	// If user is authenticated
	if (user.status == 200) {
		return {
			credentials: { username: user.user },
			addUserForm
		};
	} else {
		// Redirect to login page if not authenticated
		throw redirect(302, `/login`);
	}
}

// Actions object containing addUser function
export const actions: Actions = {
	addUser: async (event) => {
		try {
			// Validate addUserForm data
			let addUserForm = await superValidate(event, addUserSchema);
			let email = addUserForm.data.email;
			let role = addUserForm.data.role;
			// Check if email is already registered
			let key = await auth.getKey('email', email);

			// If email is already registered
			if (key) return { form: addUserForm, message: 'This email is already registered' };

			// Create new user with provided email and role
			let user = await auth.createUser({
				primaryKey: {
					providerId: 'email',
					providerUserId: email,
					password: null
				},
				attributes: {
					username: null,
					role
				}
			});
			// Issue password token for new user
			const tokenHandler = passwordToken(auth as any, 'register', {
				expiresIn: 60 * 60, // expiration in 1 hour,
				length: 16 // default
			});

			// Issue password token for new user
			let token = (await tokenHandler.issue(user.userId)).toString();

			console.log(token);

			// Return addUserForm object
			return { form: addUserForm };
		} catch (error) {
			if (error instanceof LuciaError) {
				// Handle Lucia Auth error here
				console.error(error);
				return { form: null, message: 'An error occurred while adding the user' };
			} else {
				// Handle other errors here
				console.error(error);
				return { form: null, message: 'An unknown error occurred' };
			}
		}
	}
};
