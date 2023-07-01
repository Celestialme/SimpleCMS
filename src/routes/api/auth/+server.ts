import type { Cookies } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { auth } from '@src/routes/api/db';
import { SESSION_COOKIE_NAME } from 'lucia-auth';
export const POST: RequestHandler = async ({ request, cookies }) => {
	let formData = await request.formData();

	let authType = formData.get('authType') as 'signOut';

	if (authType == 'signOut') {
		return await signOut(cookies);
	} else {
		return new Response('', { status: 404 });
	}
};

async function signOut(cookies: Cookies) {
	try {
		let sessionID = cookies.get(SESSION_COOKIE_NAME) as string;
		await auth.invalidateSession(sessionID);
		cookies.delete(SESSION_COOKIE_NAME);
		return new Response(JSON.stringify({ status: 200 }));
	} catch (e) {
		return new Response(JSON.stringify({ status: 404 }));
	}
}
