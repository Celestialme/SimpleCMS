import type { Cookies } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { auth } from '@src/routes/api/db';
export const POST: RequestHandler = async ({ request, cookies }) => {
	let formData = await request.formData();
	let email = formData.get('email') as string;
	let password = formData.get('password') as string;
	let authType = formData.get('authType') as 'signIn' | 'signUp';

	if (authType == 'signIn') {
		return await signIn(email, password, cookies);
	} else if (authType == 'signUp') {
		return await signUp(email, password, cookies);
	} else if (authType == 'signOut') {
		return await signOut(cookies);
	} else {
		return new Response('', { status: 404 });
	}
};

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
	if (!user) return new Response(JSON.stringify({ status: 404 }));
	const session = await auth.createSession(user.userId);
	cookies.set('credentials', JSON.stringify({ username: user.username }), {
		path: '/'
	});
	return new Response(JSON.stringify({ user: user.username, status: 200 }));
}

async function signIn(email: string, password: string, cookies: Cookies) {
	let key = await auth.useKey('email', email, password).catch(() => null);
	if (!key) return new Response(JSON.stringify({ status: 404 }));
	const session = await auth.createSession(key.userId);
	let user = await auth.getUser(key.userId);
	cookies.set('credentials', JSON.stringify({ username: user.username, session: session.sessionId }), {
		path: '/'
	});

	return new Response(JSON.stringify({ userername: user.username, session: session.sessionId, status: 200 }));
}

async function signOut(cookies: Cookies) {
	let res = cookies.get('credentials');
	if (!res) return new Response(JSON.stringify({ status: 404 }));
	let sessionID = JSON.parse(res).session;
	if (!sessionID) return new Response(JSON.stringify({ status: 404 }));
	await auth.invalidateSession(sessionID);
	cookies.delete('credentials');

	return new Response(JSON.stringify({ status: 200 }));
}
