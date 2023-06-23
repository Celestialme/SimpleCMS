import { redirect, type Actions } from '@sveltejs/kit';
import { auth } from '../api/db';
import { validate } from '@src/utils/utils';
import { superValidate } from 'sveltekit-superforms/server';
import { addUserSchema } from '@src/utils/formSchemas';
import { passwordToken } from '@lucia-auth/tokens';
export async function load(event) {
	let session = JSON.parse(event.cookies.get('credentials') || '{"username":null,"session":null}') as { username: string; session: string };
	let user = await validate(auth, session.session);
	let addUserForm = await superValidate(event, addUserSchema);
	if (user.status == 200) {
		return {
			credentials: { username: user.user },
			addUserForm
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
		const tokenHandler = passwordToken(auth as any, 'register', {
			expiresIn: 60 * 60, // expiration in 1 hour,
			length: 16 // default
		});
		let token = (await tokenHandler.issue(user.userId)).toString();
		console.log(token);
		return { form: addUserForm };
	}
};
