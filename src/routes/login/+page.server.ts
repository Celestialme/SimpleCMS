import { fail, type Actions, type Cookies, redirect } from '@sveltejs/kit';

import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { loginSchema, signUpSchema, recoverSchema } from '../../utils/formSchemas';
import { auth } from '@src/routes/api/db';
import mongoose from 'mongoose';
import { passwordToken } from '@lucia-auth/tokens';
export const actions: Actions = {
	signIn: async (event) => {
		let signInForm = await superValidate(event, loginSchema);
		const email = signInForm.data.email;
		const password = signInForm.data.password;
		let resp = await signIn(email, password, event.cookies);
		if (resp) {
			throw redirect(303, '/');
		} else {
			return { form: signInForm };
		}
	},
	recover: async (event) => {
		let recoverForm = await superValidate(event, recoverSchema);

		const email = recoverForm.data.email;
		let resp = await recover(email, event.cookies);
		if (resp) {
			throw redirect(303, '/');
		} else {
			return { form: recoverForm };
		}
	},
	signUp: async (event) => {
		let signUpForm = await superValidate(event, signUpSchema);
		const email = signUpForm.data.email;
		const password = signUpForm.data.password;
		const token = signUpForm.data.token;
		let key = await auth.getKey('email', email).catch(() => null);
		console.log(key);
		let resp: { status: boolean; message?: string } = { status: false };
		if (key && key.passwordDefined) {
			// finished account exists
			return { form: signUpForm, message: 'This email is already registered' };
		} else if (!key) {
			// no account exists
			resp = await signUp(email, password, event.cookies);
		} else if (key.passwordDefined == false) {
			// unfinished account exists
			resp = await finishRegistration(email, password, token, event.cookies);
			console.log('resp', resp);
		}
		if (resp.status) {
			throw redirect(303, '/');
		} else {
			return { form: signUpForm, message: resp.message || 'unknown error' };
		}
	}
};
export const load: PageServerLoad = async (event) => {
	await event.parent();
	let loginForm = await superValidate(event, loginSchema);
	let recoverForm = await superValidate(event, recoverSchema);
	let withoutToken = await superValidate(event, signUpSchema.innerType().omit({ token: true }));
	let withToken = await superValidate(event, signUpSchema);

	let signUpForm: typeof withToken = (await mongoose.models['auth_key'].countDocuments()) === 0 ? (withoutToken as any) : withToken;
	return {
		loginForm,
		signUpForm,
		recoverForm
	};
};

async function signIn(email: string, password: string, cookies: Cookies) {
	let key = await auth.useKey('email', email, password).catch(() => null);
	if (!key || !key.passwordDefined) return { status: false, message: 'Invalid Credentials' };
	const session = await auth.createSession(key.userId);
	let user = await auth.getUser(key.userId);
	cookies.set('credentials', JSON.stringify({ username: user.username, session: session.sessionId }), {
		path: '/'
	});
	return { status: true };
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
				username: 'Admin',
				role: 'admin'
			}
		})
		.catch((e) => null);
	console.log(user);
	if (!user) return { status: false, message: 'user does not exist' };
	const session = await auth.createSession(user.userId);
	cookies.set('credentials', JSON.stringify({ username: user.username, session: session.sessionId }), {
		path: '/'
	});
	return { status: true };
}
async function finishRegistration(email: string, password: string, token: string, cookies: Cookies) {
	let key = await auth.useKey('email', email, password).catch(() => null);
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
async function recover(email: string, cookies: Cookies) {
	console.log(email);
	//TODO recover login here
	return { status: false };
}
