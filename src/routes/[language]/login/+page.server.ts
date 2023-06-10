import { fail, type Actions, type Cookies, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { superValidate } from 'sveltekit-superforms/server';
import { loginFormSchema, forgotFormSchema, resetFormSchema, signUpSchema } from './formSchemas';

import { auth } from '@src/routes/api/db';

// actions for signing in and signing up a user with form data
export const actions: Actions = {
	//Function for handling the sign-in form submission and user authentication
	signIn: async (event) => {
		let signInForm = await superValidate(null, loginFormSchema);

		const form = await event.request.formData();
		const email = (form.get('email') as string).toLowerCase();
		const password = form.get('password') as string;

		let resp = await signIn(email, password, event.cookies);

		console.log('signInForm', signInForm);

		if (resp) {
			throw redirect(303, '/');
		} else {
			return { form: signInForm };
		}
	},

	// Function for handling the Forgotten Password
	// TODO: Correct logic to check if Email exand to trigger Send Email new paswword
	forgotPW: async (event) => {
		let pwforgottenForm = await superValidate(null, forgotFormSchema);

		const form = await event.request.formData();
		const email = (form.get('email') as string).toLowerCase();

		let resp = await forgotPW(email, event.cookies);

		console.log('pwforgottenForm', pwforgottenForm);

		if (resp) {
			throw redirect(303, '/');
		} else {
			return { form: pwforgottenForm };
		}
	},

	// Function for handling the RESET
	// TODO: Correct logic to check reset PW with Recived Token and to set new password
	resetPW: async (event) => {
		let pwresetForm = await superValidate(null, resetFormSchema);

		const form = await event.request.formData();
		const email = (form.get('email') as string).toLowerCase();
		const password = form.get('password') as string;
		const token = form.get('token') as string;

		let resp = await resetPW(email, password, token, event.cookies);

		console.log('pwresetForm', pwresetForm);

		if (resp) {
			throw redirect(303, '/');
		} else {
			return { form: pwresetForm };
		}
	},

	//Function for handling the sign-up form submission and user creation
	//TODO: Check if user Exists
	signUp: async (event) => {
		let signUpForm = await superValidate(null, signUpSchema);

		const form = await event.request.formData();
		const username = form.get('username') as string;
		const email = (form.get('email') as string).toLowerCase();
		const password = form.get('password') as string;
		const confirm_password = form.get('password') as string;

		let resp = await signUp(username, email, password, confirm_password, event.cookies);

		console.log('signUpForm', signUpForm);

		if (resp) {
			throw redirect(303, '/');
		} else {
			return { form: signUpForm };
		}
	}
};

// load and validate login and sign up forms
export const load: PageServerLoad = async (event) => {
	await event.parent();
	let loginForm = await superValidate(event, loginFormSchema);
	let signUpForm = await superValidate(event, signUpSchema);
	return {
		loginForm,
		signUpForm
	};
};

// signIn user with email and password, create session and set cookie
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

//Function for creating a new user account and creating a session.
async function signUp(username: string, email: string, password: string, confirm_password: string, cookies: Cookies) {
	if (password !== confirm_password) {
		return false;
	}

	let user = await auth
		.createUser({
			primaryKey: {
				providerId: 'email',
				providerUserId: email,
				password: password
			},
			attributes: {
				username: username
			}
		})
		.catch((e) => {
			console.log(e);
			return null;
		});
	console.log(user);
	if (!user) return false;
	const session = await auth.createSession(user.userId);
	cookies.set('credentials', JSON.stringify({ username: user.username, session: session.sessionId }), {
		path: '/'
	});
	return true;
}
