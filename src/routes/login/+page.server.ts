import { type Actions, type Cookies, redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { loginSchema, signUpSchema_token, recoverSchema, signUpSchema_noToken, type SignupSchema } from '../../utils/formSchemas';
import { auth } from '@src/routes/api/db';

export const actions: Actions = {
	signIn: async ({ request, cookies }) => {
		let data = await request.formData();
		let entries = Object.fromEntries(data);
		let form = loginSchema.safeParse({ ...entries, isToken: entries.isToken === 'true' ? true : false });
		if (!form.success) return fail(400, { message: 'invalid form members' });
		const email = form.data.email;
		const password = form.data.password;
		const isToken = form.data.isToken;
		let resp = await signIn(email, password, isToken, cookies);

		if (resp.status) {
			throw redirect(303, '/');
		} else {
			return fail(400, { message: resp.message });
		}
	},
	recover: async ({ request }) => {
		let data = await request.formData();
		let form = recoverSchema.safeParse(Object.fromEntries(data));
		if (!form.success) return fail(400, { message: 'invalid email' });
		let user = await auth.checkUser({ email: form.data.email });
		if (!user) return fail(404, { message: 'user does not exist' });
		let token = await auth.createToken(user.id, 60 * 60 * 1000);
		console.log(token); // send token to user via email
		return { message: 'token has been sent to email' };
	},
	signUp: async ({ request, cookies }) => {
		let isFirst = (await auth.getUserCount()) == 0;
		let signUpSchema = isFirst ? signUpSchema_noToken : signUpSchema_token;
		let data = await request.formData();
		let res = signUpSchema.safeParse(Object.fromEntries(data));
		if (!res.success) return fail(400, { message: 'invalid form members' });
		let form = res.data as SignupSchema;
		const email = form.email;
		const password = form.password;
		const username = form.username;
		const token = 'token' in form ? form.token : '';
		let user = await auth.checkUser({ email });
		let resp: { status: boolean; message?: string } = { status: false };

		if (user && user.is_registered) {
			// finished account exists
			return fail(400, { message: 'This email is already registered' });
		} else if (isFirst) {
			// no account exists sign up for admin
			resp = await FirstUsersignUp(username, email, password, cookies);
		} else if (user && user.is_registered == false) {
			// unfinished account exists
			resp = await finishRegistration(username, email, password, token, cookies);
		} else if (!user && !isFirst) {
			resp = { status: false, message: 'this user is not defined by admin' };
		}
		if (resp.status) {
			throw redirect(303, '/');
		} else {
			return fail(400, { message: resp.message || 'unknown error' });
		}
	}
};
export const load: PageServerLoad = async (event) => {
	await event.parent();

	let firstUserExists = (await auth.getUserCount()) != 0;

	return {
		firstUserExists
	};
};

async function signIn(
	email: string,
	password: string,
	isToken: boolean,
	cookies: Cookies
): Promise<{ status: true } | { status: false; message: string }> {
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
		let user = await auth.checkUser({ email });
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
	let user = await auth.checkUser({ email });
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
