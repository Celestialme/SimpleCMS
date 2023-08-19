import type { Cookies } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { auth } from '@src/routes/api/db';
import { SESSION_COOKIE_NAME } from 'lucia-auth';

// Define a POST request handler function
export const POST: RequestHandler = async ({ request, cookies }) => {
	const formData = await request.formData();

	const authType = formData.get('authType') as 'signOut';

	if (authType == 'signOut') {
		return await signOut(cookies);
	} else {
		return new Response('', { status: 404 });
	}
};

// Define an asynchronous function to sign out a user
async function signOut(cookies: Cookies) {
	try {
		const sessionID = cookies.get(SESSION_COOKIE_NAME) as string;
		await auth.invalidateSession(sessionID);
		cookies.delete(SESSION_COOKIE_NAME);
		return new Response(JSON.stringify({ status: 200 }));
	} catch (e) {
		console.log('signOut', e);
		return new Response(JSON.stringify({ status: 404 }));
	}
}
