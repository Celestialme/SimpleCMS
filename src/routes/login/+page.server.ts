import { fail, type Cookies, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import { passwordToken } from '@lucia-auth/tokens';

import { superValidate, message } from 'sveltekit-superforms/server';
import { loginFormSchema, forgotFormSchema, resetFormSchema, signUpFormSchema, signUpOtherFormSchema } from '@src/utils/formSchemas';
import { auth } from '@src/routes/api/db';

import mongoose from 'mongoose';

// load and validate login and sign up forms
export const load: PageServerLoad = async (event) => {
	await event.parent();

	// Different schemas, so no id required.

	// SignIn
	const loginForm = await superValidate(event, loginFormSchema);
	const forgotForm = await superValidate(event, forgotFormSchema);
	const resetForm = await superValidate(event, resetFormSchema);

	// SignUp
	const signUpForm = await superValidate(event, signUpFormSchema);
	const signUpFormOther = await superValidate(event, signUpOtherFormSchema);

	// check if first user exist
	const firstUserExists = (await mongoose.models['auth_user'].countDocuments()) > 0;

	// Always return all Forms in load and form actions.
	return {
		// SignIn
		loginForm,
		forgotForm,
		resetForm,

		// SignUP
		signUpForm,
		signUpFormOther,
		firstUserExists
	};
};

// actions for SignIn and SignUp a user with form data
export const actions: Actions = {
	//Function for handling the SignIn form submission and user authentication
	signIn: async (event) => {
		const signInForm = await superValidate(event, loginFormSchema);
		//console.log('signInForm', signInForm);

		// Convenient validation check:
		//if (!signInForm.valid) return fail(400, { signInForm });

		// Validate with Lucia
		const email = signInForm.data.email.toLocaleLowerCase();
		const password = signInForm.data.password;

		let resp = await signIn(email, password, event.cookies);

		if (resp) {
			// Return message if form is submitted successfully
			message(signInForm, 'SignIn form submitted');
			throw redirect(303, '/');
		} else {
			return { form: signInForm };
		}
	},

	// Function for handling the Forgotten Password
	// TODO: Correct logic to check if Email expand to trigger Send Email new password
	forgotPW: async (event) => {
		const pwforgottenForm = await superValidate(event, forgotFormSchema);
		//console.log('pwforgottenForm', pwforgottenForm);

		// Convenient validation check:
		//if (!pwforgottenForm.valid) return fail(400, { pwforgottenForm });

		// Validate with Lucia
		const email = pwforgottenForm.data.email.toLocaleLowerCase();

		let resp = await forgotPW(email, event.cookies);

		if (resp) {
			// Return message if form is submitted successfully
			message(pwforgottenForm, 'SignIn Forgotten form submitted');
			throw redirect(303, '/');
		} else {
			return { form: pwforgottenForm };
		}
	},

	// Function for handling the RESET
	// TODO: Correct logic to check reset PW with Received Token and to set new password
	resetPW: async (event) => {
		let pwresetForm = await superValidate(event, resetFormSchema);
		//console.log('pwresetForm', pwresetForm);

		// Convenient validation check:
		//if (!pwresetForm.valid) return fail(400, { pwresetForm });

		// Validate with Lucia
		const email = pwresetForm.data.email.toLocaleLowerCase();
		const password = pwresetForm.data.password;
		const token = pwresetForm.data.token;

		let resp = await resetPW(email, password, token, event.cookies);

		if (resp) {
			// Return message if form is submitted successfully
			message(pwresetForm, 'SignIn Reset form submitted');
			throw redirect(303, '/');
		} else {
			return { form: pwresetForm };
		}
	},

	//Function for handling the sign-up form submission and user creation
	signUp: async (event) => {
		let signUpForm = await superValidate(event, signUpFormSchema);
		//console.log('signUpForm', signUpForm);

		// Convenient validation check:
		//if (!signUpForm.valid) return fail(400, { signUpForm });

		// Validate with Lucia
		const username = signUpForm.data.username;
		const email = signUpForm.data.email.toLocaleLowerCase();
		const password = signUpForm.data.password;
		const confirm_password = signUpForm.data.confirm_password;

		let resp = await signUp(username, email, password, confirm_password, event.cookies);

		if (resp) {
			// Return message if form is submitted successfully
			message(signUpForm, 'SignUp First User form submitted');
			throw redirect(303, '/');
		} else {
			return { form: signUpForm };
		}
	},

	//Function for handling the sign-up form submission and user creation
	signUpOther: async (event) => {
		let signUpOtherForm = await superValidate(event, signUpOtherFormSchema);
		//console.log('signUpOtherForm', signUpOtherForm);

		// Convenient validation check:
		//if (!signUpOtherForm.valid) return fail(400, { signUpOtherForm });

		// TODO: Do something with the validated data
		const username = signUpOtherForm.data.username;
		const email = signUpOtherForm.data.email.toLocaleLowerCase();
		const password = signUpOtherForm.data.password;
		const confirm_password = signUpOtherForm.data.confirm_password;
		const isToken = signUpOtherForm.data.isToken;

		let resp = await signUpOther(username, email, password, confirm_password, isToken, event.cookies);

		if (resp) {
			// Return message if form is submitted successfully
			message(signUpOtherForm, 'SignUp Other User form submitted');
			throw redirect(303, '/');
		} else {
			return { form: signUpOtherForm };
		}
	}
};

// LUCIA setup -------------------------------

// SignIn user with email and password, create session and set cookie
async function signIn(email: string, password: string, cookies: Cookies) {
	let key = await auth.useKey('email', email, password).catch((error) => {
		console.log('signIn key error', error);
		return null;
	});

	//console.log('signIn key', key);

	if (!key) return false;

	const session = await auth.createSession(key.userId);

	let user = await auth.getUser(key.userId);

	// Set the credentials cookie
	cookies.set('credentials', JSON.stringify({ username: user.username, session: session.sessionId }), {
		path: '/'
	});
	return true;
}

async function forgotPW(email: string, cookies: Cookies) {
	const key = await auth.forgotPassword(email);
	if (!key) return false;

	// Send email with reset password link

	return true;
}

async function resetPW(email: string, password: string, token: string, cookies: Cookies) {
	const key = await auth.resetPassword(email, password, token);
	if (!key) return false;

	// Set the credentials cookie
	cookies.set('credentials', JSON.stringify({ username: key.username, session: key.sessionId }), {
		path: '/'
	});
	return true;
}

// async function recover(email: string, cookies: Cookies) {
// 	const tokenHandler = passwordToken(auth as any, 'register', {
// 		expiresIn: 60 * 60, // expiration in 1 hour,
// 		length: 16 // default
// 	});
// 	let key = await auth.getKey('email', email).catch(() => null);
// 	if (!key) return { status: false, message: 'user does not exist' };
// 	let token = (await tokenHandler.issue(key.userId)).toString();
// 	console.log(token); // send token to user via email
// 	return { status: true, message: 'token has been sent to email' };
// }

// Function for creating a new user account and creating a session.

async function signUp(username: string, email: string, password: string, confirm_password: string, cookies: Cookies) {
	if (password !== confirm_password) {
		return false;
	}

	// Convert email to lowercase
	email = email.toLowerCase();

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

	//console.log('signUp User', user);

	if (!user) return false;
	const session = await auth.createSession(user.userId);

	// Set the credentials cookie
	cookies.set('credentials', JSON.stringify({ username: user.username, session: session.sessionId }), {
		path: '/'
	});
	return true;
}

async function signUpOther(username: string, email: string, password: string, confirm_password: string, token: string, cookies: Cookies) {
	let key = await auth.getKey('email', email).catch(() => null);
	if (!key) return { status: false, message: 'user does not exist' };
	const tokenHandler = passwordToken(auth as any, 'register', { expiresIn: 0 });
	try {
		await tokenHandler.validate(token, key.userId);

		await auth.updateKeyPassword('email', email, password);
		const session = await auth.createSession(key.userId);
		let user = await auth.getUser(key.userId);
		cookies.set('credentials', JSON.stringify({ username: user.username, session: session.sessionId }), {
			path: '/'
		});
		return { status: true };
	} catch (e) {
		return { status: false, message: 'invalid token' };
	}
}
