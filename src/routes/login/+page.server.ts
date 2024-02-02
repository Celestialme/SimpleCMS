import { type Actions, type Cookies, redirect } from '@sveltejs/kit';

import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { loginSchema, signUpSchema, recoverSchema } from '../../utils/formSchemas';
import { auth } from '@src/routes/api/db';

import { consumeToken, createToken } from '@src/auth/tokens';

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
		let user = await auth.checkUser(email);
		let resp: { status: boolean; message?: string } = { status: false };
		let isFirst = (await auth.getUserCount()) == 0;
		if (user && user.is_registered) {
			// finished account exists
			return { form: signUpForm, message: 'This email is already registered' };
		} else if (isFirst) {
			// no account exists sign up for admin
			resp = await FirstUsersignUp(username, email, password, event.cookies);
		} else if (user && user.is_registered == false) {
			// unfinished account exists
			resp = await finishRegistration(username, email, password, token, event.cookies);
		} else if (!user && !isFirst) {
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

	let signUpForm: typeof withToken = (await auth.getUserCount()) == 0 ? (withoutToken as any) : withToken;

	return {
		loginForm,
		signUpForm,
		recoverForm
	};
};

async function signIn(email: string, password: string, isToken: boolean, cookies: Cookies) {
	if (!isToken) {
		let user = await auth.login(email, password);
		if (!user) return { status: false, message: 'Invalid Credentials' };
		let session = await auth.createSession({ user_id: user.id });
		let sessionCookie = auth.createSessionCookie(session);
		cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
		await auth.updateUserAttributes(user, { lastAuthMethod: 'password' });
		return { status: true };
	} else {
		let token = password;
		let user = await auth.checkUser(email);
		if (!user) return { status: false, message: 'user does not exist' };

		let result = await auth.consumeToken(token, user.id);
		if (result.status) {
			const session = await auth.createSession({ user_id: user.id });
			const sessionCookie = auth.createSessionCookie(session);
			cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
			await auth.updateUserAttributes(user, { lastAuthMethod: 'token' });
			return { status: true };
		} else {
			return result;
		}
	}
}

async function FirstUsersignUp(username: string, email: string, password: string, cookies: Cookies) {
	let user = await auth.createUser({
		password,
		email,
		username,
		role: 'admin',
		lastAuthMethod: 'password',
		is_registered: true
	});
	if (!user) return { status: false, message: 'user does not exist' };
	const session = await auth.createSession({ user_id: user.id });
	const sessionCookie = auth.createSessionCookie(session);
	cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

	return { status: true };
}
async function finishRegistration(username: string, email: string, password: string, token: string, cookies: Cookies) {
	let user = await auth.checkUser(email);
	if (!user) return { status: false, message: 'user does not exist' };

	let result = await auth.consumeToken(token, user.id);

	if (result.status) {
		await auth.updateUserAttributes(user, { username, password, lastAuthMethod: 'password', is_registered: true });
		const session = await auth.createSession({ user_id: user.id });
		const sessionCookie = auth.createSessionCookie(session);
		cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

		return { status: true };
	} else {
		return result;
	}
}
async function recover(email: string, cookies: Cookies) {
	let user = await auth.checkUser(email);
	if (!user) return { status: false, message: 'user does not exist' };
	let token = await auth.createToken(user.id, 60 * 60 * 1000);
	console.log(token); // send token to user via email
	return { status: true, message: 'token has been sent to email' };
}
