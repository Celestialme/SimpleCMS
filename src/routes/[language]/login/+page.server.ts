import { fail, type Actions, type Cookies, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { superValidate } from 'sveltekit-superforms/server';
import { loginFormSchema, forgotFormSchema, resetFormSchema, signUpFormSchema, signUpOtherFormSchema } from './formSchemas';

import { auth } from '@src/routes/api/db';
import mongoose from 'mongoose';

// actions for signing in and signing up a user with form data
export const actions: Actions = {
	//Function for handling the sign-in form submission and user authentication
	signIn: async (event) => {
		let signInForm = await superValidate(event, loginFormSchema);
		//console.log('signInForm', signInForm);
		const email = signInForm.data.email.toLocaleLowerCase();
		const password = signInForm.data.password;

		let resp = await signIn(email, password, event.cookies);

		if (resp) {
			throw redirect(303, '/');
		} else {
			return { form: signInForm };
		}
	},

	// Function for handling the Forgotten Password
	// TODO: Correct logic to check if Email expand to trigger Send Email new password
	forgotPW: async (event) => {
		let pwforgottenForm = await superValidate(event, forgotFormSchema);

		const email = pwforgottenForm.data.email.toLocaleLowerCase();

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
		let pwresetForm = await superValidate(event, resetFormSchema);

		const email = pwresetForm.data.email.toLocaleLowerCase();
		const password = pwresetForm.data.password;
		const token = pwresetForm.data.token;

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
		let signUpForm = await superValidate(null, signUpFormSchema);

		const username = signUpForm.data.username;
		const email = signUpForm.data.email.toLocaleLowerCase();
		const password = signUpForm.data.password;
		const confirm_password = signUpForm.data.confirm_password;

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
	// SignIn
	let loginForm = await superValidate(event, loginFormSchema);
	let forgotForm = await superValidate(event, forgotFormSchema);
	let resetForm = await superValidate(event, resetFormSchema);
	// signup
	let signUpForm = await superValidate(event, signUpFormSchema);
	let signUpFormOther = await superValidate(event, signUpOtherFormSchema);
	// check if first user exist
	const firstUserExists = (await mongoose.models['auth_user'].countDocuments()) > 0;

	return {
		loginForm,
		forgotForm,
		resetForm,

		signUpForm,
		signUpFormOther,
		firstUserExists
	};
};

// signIn user with email and password, create session and set cookie
async function signIn(email: string, password: string, cookies: Cookies) {
	let key = await auth.useKey('email', email, password).catch(() => null);
	//console.log(key);
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
