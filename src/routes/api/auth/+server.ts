import type { RequestHandler } from './$types';
import { auth } from '@src/routes/api/db';
export const POST: RequestHandler = async ({ request }) => {
	let formData = await request.formData();
	let email = formData.get('email') as string;
	let password = formData.get('password') as string;
	let authType = formData.get('authType') as 'signIn' | 'signUp';
	let sessionID = formData.get('sessionID') as string | null;
	if (authType == 'signIn') {
		return await signIn(email, password);
	} else if (authType == 'signUp') {
		return await signUp(email, password);
	} else if (authType == 'validate') {
		return await validate(sessionID);
	} else {
		return new Response('', { status: 404 });
	}
};

async function signUp(email: string, password: string) {
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
	if (!user) return new Response(JSON.stringify({ status: 404 }));
	const session = await auth.createSession(user.userId);
	return new Response(JSON.stringify({ user: user.username, session: session.sessionId, status: 200 }));
}

async function signIn(email: string, password: string) {
	let key = await auth.useKey('email', email, password).catch(() => null);
	if (!key) return new Response(JSON.stringify({ status: 404 }));
	const session = await auth.createSession(key.userId);
	let user = await auth.getUser(key.userId);
	return new Response(JSON.stringify({ userername: user.username, session: session.sessionId, status: 200 }));
}
async function validate(sessionID: string | null) {
	if (!sessionID) {
		return new Response(JSON.stringify({ status: 404 }));
	}
	const resp = await auth.validateSessionUser(sessionID).catch(() => null);
	if (!resp) return new Response(JSON.stringify({ status: 404 }));
	return new Response(JSON.stringify({ user: resp.user.username, session: resp.session?.sessionId, status: 200 }));
}
