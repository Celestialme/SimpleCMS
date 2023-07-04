import { type Actions, type Cookies, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import mongoose from 'mongoose';

import { superValidate, message } from 'sveltekit-superforms/server';
import { loginFormSchema, forgotFormSchema, resetFormSchema, signUpFormSchema } from '@src/utils/formSchemas';
import { auth } from '@src/routes/api/db';
import { passwordToken } from '@lucia-auth/tokens';
import type { User } from '@src/collections/Auth';

// load and validate login and sign up forms
export const load: PageServerLoad = async (event) => {
	await event.parent();

	// Different schemas, so no id required.

	// SignIn
	let loginForm = await superValidate(event, loginFormSchema);
	let forgotForm = await superValidate(event, forgotFormSchema);
	let resetForm = await superValidate(event, resetFormSchema);
	//let recoverForm = await superValidate(event, recoverSchema);

	// SignUp FirstUser
	let withoutToken = await superValidate(event, signUpFormSchema.innerType().omit({ token: true }));
	// SignUp Other Users
	let withToken = await superValidate(event, signUpFormSchema);

	// check if first user exist
	let signUpForm: typeof withToken = (await mongoose.models['auth_key'].countDocuments()) === 0 ? (withoutToken as any) : withToken;

	// Always return all Forms in load and form actions.
	return {
		// SignIn
		loginForm,
		forgotForm,
		resetForm,
		// recoverForm

		// SignUP
		signUpForm
	};
};

// Actions for SignIn and SignUp a user with form data
export const actions: Actions = {
	//Function for handling the SignIn form submission and user authentication
	signIn: async (event) => {
		let signInForm = await superValidate(event, loginFormSchema);
		//console.log('signInForm', signInForm);

		// Convenient validation check:
		//if (!signInForm.valid) return fail(400, { signInForm });

		// Validate with Lucia
		const email = signInForm.data.email.toLocaleLowerCase();
		const password = signInForm.data.password;
		const isToken = signInForm.data.isToken;

		let resp = await signIn(email, password, isToken, event.cookies);

		if (resp.status) {
			// Return message if form is submitted successfully
			message(signInForm, 'SignIn form submitted');
			throw redirect(303, '/');
		} else {
			return { form: signInForm, message: resp.message };
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
		const username = signUpFormSchema.data.username;
		const email = signUpFormSchema.data.email.toLocaleLowerCase();
		const password = signUpFormSchema.data.password;
		const token = signUpFormSchema.data.token;

		let key = await auth.getKey('email', email).catch(() => null);
		console.log('key', key);
		let resp: { status: boolean; message?: string } = { status: false };
		let isFirst = (await mongoose.models['auth_key'].countDocuments()) == 0;

		if (key && key.passwordDefined) {
			// finished account exists
			return { form: signUpFormSchema, message: 'This email is already registered' };
		} else if (isFirst) {
			// no account exists signUp for admin
			resp = await FirstUsersignUp(username, email, password, event.cookies);
		} else if (key && key.passwordDefined == false) {
			// unfinished account exists
			resp = await finishRegistration(username, email, password, token, event.cookies);
			console.log('resp', resp);
		} else if (!key && !isFirst) {
			resp = { status: false, message: 'This user was not defined by admin' };
		}

		if (resp.status) {
			// send welcome email
			await event.fetch('/api/sendMail', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email: email,
					subject: 'New Admin registration',
					message: 'New Admin registration',
					templateName: 'Welcome',
					props: {
						username: username,
						email: email
					}
				})
			});

			// Return message if form is submitted successfully
			message(signUpForm, 'SignUp User form submitted');
			throw redirect(303, '/');
		} else {
			return { form: signUpForm, message: resp.message || 'Unknown error' };
		}
	}
};

// LUCIA setup -------------------------------

// SignIn user with email and password, create session and set cookie
async function signIn(email: string, password: string, isToken: boolean, cookies: Cookies) {
	if (!isToken) {
		let key = await auth.useKey('email', email, password).catch(() => null);
		if (!key || !key.passwordDefined) return { status: false, message: 'Invalid Credentials' };
		const session = await auth.createSession(key.userId);
		const sessionCookie = auth.createSessionCookie(session);
		console.log(sessionCookie);
		cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

		let authMethod = 'password';
		await auth.updateUserAttributes(key.userId, { authMethod });
		return { status: true };
	} else {
		let token = password;
		let key = await auth.getKey('email', email).catch(() => null);
		if (!key) return { status: false, message: 'user does not exist' };
		const tokenHandler = passwordToken(auth as any, 'register', { expiresIn: 0 });
		try {
			await tokenHandler.validate(token, key.userId);
			const session = await auth.createSession(key.userId);
			const sessionCookie = auth.createSessionCookie(session);
			cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
			let authMethod = 'token';
			await auth.updateUserAttributes(key.userId, { authMethod });
			return { status: true };
		} catch (e) {
			return { status: false, message: 'invalid token' };
		}
	}
}
async function FirstUsersignUp(username: string, email: string, password: string, cookies: Cookies) {
	let user: User = await auth
		.createUser({
			primaryKey: {
				providerId: 'email',
				providerUserId: email,
				password: password
			},
			attributes: {
				username,
				role: 'admin'
			}
		})
		.catch((e) => null);
	console.log(user);
	if (!user) return { status: false, message: 'user does not exist' };
	const session = await auth.createSession(user.id);
	const sessionCookie = auth.createSessionCookie(session);
	// Set the credentials cookie
	cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

	return { status: true };
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

// Function create a new FIRST USER account as ADMIN and creating a session.
async function signUp(username: string, email: string, password: string, cookies: Cookies, event: any) {
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
				username: username,
				role: 'admin' // First user
			}
		})
		.catch((e) => {
			console.log(e);
			return null;
		});

	if (!user) return { status: false, message: 'User does not exist' };

	const session = await auth.createSession(user.userId);

	// Set the credentials cookie
	cookies.set('credentials', JSON.stringify({ username: user.username, session: session.sessionId }), {
		path: '/'
	});
	return { status: true };
}

// Function create a new OTHER USER account and creating a session.
async function finishRegistration(username: string, email: string, password: string, token: string, cookies: Cookies, event: any) {
	// SignUp Token
	let key = await auth.getKey('email', email).catch(() => null);
	if (!key) return { status: false, message: 'User does not exist' };
	const tokenHandler = passwordToken(auth as any, 'register', { expiresIn: 0 });

	try {
		let authMethod = 'password';
		await tokenHandler.validate(token, key.userId);
		await auth.updateUserAttributes(key.userId, { username, authMethod });
		await auth.updateKeyPassword('email', email, password);

		const session = await auth.createSession(key.userId);
		const sessionCookie = auth.createSessionCookie(session);

		// Set the credentials cookie
		cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

		return { status: true };
	} catch (e) {
		return { status: false, message: 'Invalid token' };
	}
}

// Function to Reset Password.
//TODO Needs more work to send My MAIL

async function recover(email: string, cookies: Cookies) {
	// TODO: More secure Token
	const tokenHandler = passwordToken(auth as any, 'register', {
		expiresIn: 60 * 60, // expiration in 1 hour,
		length: 43 // default
	});

	let key = await auth.getKey('email', email).catch(() => null);
	if (!key) return { status: false, message: 'User does not exist' };

	let token = (await tokenHandler.issue(key.userId)).toString();

	console.log(token); // TODO send token to user via email

	return { status: true, message: 'Your Token has been sent to email' };
}
