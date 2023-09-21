import { type Actions, type Cookies, redirect } from '@sveltejs/kit';

import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { loginSchema, signUpSchema, recoverSchema } from '../../utils/formSchemas';
import { auth } from '@src/routes/api/db';
import mongoose from 'mongoose';

import type { User } from '@src/collections/Auth';
import { consumeToken, createToken } from '@src/utils/tokens';

export const actions: Actions = {
	signIn: async (event) => {
		let signInForm = await superValidate(event, loginSchema);
		const email = signInForm.data.email;
		const password = signInForm.data.password;
		const isToken = signInForm.data.isToken;
		let resp = await signIn(email, password, isToken, event.cookies);
		if (resp.status) {
			throw redirect(303, '/');
		} else {
			return { form: signInForm, message: resp.message };
		}
	},
	recover: async (event) => {
		let recoverForm = await superValidate(event, recoverSchema);

		const email = recoverForm.data.email;
		let resp = await recover(email, event.cookies);

		return { form: recoverForm, message: resp.message };
	},
	signUp: async (event) => {
		let signUpForm = await superValidate(event, signUpSchema);
		const email = signUpForm.data.email;
		const password = signUpForm.data.password;
		const username = signUpForm.data.username;
		const token = signUpForm.data.token;
		let key = await auth.getKey('email', email).catch(() => null);
		console.log(key);
		let resp: { status: boolean; message?: string } = { status: false };
		let isFirst = (await mongoose.models['auth_key'].countDocuments()) == 0;
		if (key && key.passwordDefined) {
			// finished account exists
			return { form: signUpForm, message: 'This email is already registered' };
		} else if (isFirst) {
			// no account exists sign up for admin
			resp = await FirstUsersignUp(username, email, password, event.cookies);
		} else if (key && key.passwordDefined == false) {
			// unfinished account exists
			resp = await finishRegistration(username, email, password, token, event.cookies);
			console.log('resp', resp);
		} else if (!key && !isFirst) {
			resp = { status: false, message: 'this user is not defined by admin' };
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

async function signIn(email: string, password: string, isToken: boolean, cookies: Cookies) {
	if (!isToken) {
		let key = await auth.useKey('email', email, password).catch(() => null);
		if (!key || !key.passwordDefined) return { status: false, message: 'Invalid Credentials' };
		const session = await auth.createSession({ userId: key.userId, attributes: {} });
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

		let result = await consumeToken(token, key.userId);
		if (result.status) {
			const session = await auth.createSession({ userId: key.userId, attributes: {} });
			const sessionCookie = auth.createSessionCookie(session);
			cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
			let authMethod = 'token';
			await auth.updateUserAttributes(key.userId, { authMethod });
			return { status: true };
		} else {
			return result;
		}
	}
}

async function FirstUsersignUp(username: string, email: string, password: string, cookies: Cookies) {
	let user: User = await auth
		.createUser({
			key: {
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
	const session = await auth.createSession({ userId: user.id, attributes: {} });
	const sessionCookie = auth.createSessionCookie(session);
	cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

	return { status: true };
}
async function finishRegistration(username: string, email: string, password: string, token: string, cookies: Cookies) {
	let key = await auth.getKey('email', email).catch(() => null);
	if (!key) return { status: false, message: 'user does not exist' };

	let result = await consumeToken(token, key.userId);
	if (result.status) {
		let authMethod = 'password';
		await auth.updateUserAttributes(key.userId, { username, authMethod });

		await auth.updateKeyPassword('email', email, password);
		const session = await auth.createSession({ userId: key.userId, attributes: {} });
		const sessionCookie = auth.createSessionCookie(session);
		cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

		return { status: true };
	} else {
		return result;
	}
}
async function recover(email: string, cookies: Cookies) {
	let key = await auth.getKey('email', email).catch(() => null);
	if (!key) return { status: false, message: 'user does not exist' };
	let token = await createToken(key.userId, 60 * 60 * 1000);
	console.log(token); // send token to user via email
	return { status: true, message: 'token has been sent to email' };
}
