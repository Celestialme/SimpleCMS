import { fail, type Actions, type Cookies, redirect } from '@sveltejs/kit';

import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { loginSchema, signUpSchema } from './formSchemas';
import { auth } from '@src/routes/api/db';
export const actions: Actions = {
	signIn: async (event) => {
		let signInForm = await superValidate(null, loginSchema);

		const form = await event.request.formData();
		const email = form.get('email') as string;
		const password = form.get('password') as string;
		let resp = await signIn(email, password, event.cookies);
		if (resp) {
			throw redirect(303, '/');
		} else {
			return { form: signInForm };
		}
	},
	signUp: async (event) => {
		let signUpForm = await superValidate(null, signUpSchema);
		const form = await event.request.formData();
		const email = form.get('email') as string;
		const password = form.get('password') as string;
		let resp = await signUp(email, password, event.cookies);
		console.log(signUpForm);
		if (resp) {
			throw redirect(303, '/');
		} else {
			return { form: signUpForm };
		}
	}
};
export const load: PageServerLoad = async (event) => {
	await event.parent();
	let loginForm = await superValidate(event, loginSchema);
	let signUpForm = await superValidate(event, signUpSchema);
	return {
		loginForm,
		signUpForm
	};
};

async function signIn(email: string, password: string, cookies: Cookies) {
	let key = await auth.useKey('email', email, password).catch(() => null);
	console.log(key);
	if (!key) return false;
	const session = await auth.createSession(key.userId);
	let user = await auth.getUser(key.userId);
	cookies.set('credentials', JSON.stringify({ username: user.username, session: session.sessionId }), {
		path: '/'
	});
	return true;
}

async function signUp(email: string, password: string, cookies: Cookies) {
	let user = await auth
		.createUser({
			primaryKey: {
				providerId: 'email',
				providerUserId: email,
				password: password
			},
			attributes: {
				username: 'Admin'
			}
		})
		.catch((e) => null);
	console.log(user);
	if (!user) return false;
	const session = await auth.createSession(user.userId);
	cookies.set('credentials', JSON.stringify({ username: user.username, session: session.sessionId }), {
		path: '/'
	});
	return true;
}
