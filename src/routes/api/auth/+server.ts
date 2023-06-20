import mongoose from 'mongoose';
import type { Cookies } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { auth } from '@src/routes/api/db';
import { UserSchema } from '@src/collections/Auth';

// Define a POST request handler function
export const POST: RequestHandler = async ({ request, cookies }) => {
	let formData = await request.formData();

	let authType = formData.get('authType') as 'signOut';

	if (authType == 'signOut') {
		return await signOut(cookies);
	} else {
		return new Response('', { status: 404 });
	}
};

// Define an asynchronous function to sign out a user
async function signOut(cookies: Cookies) {
	let res = cookies.get('credentials');
	if (!res) return new Response(JSON.stringify({ status: 404 }));
	let sessionID = JSON.parse(res).session;
	if (!sessionID) return new Response(JSON.stringify({ status: 404 }));
	await auth.invalidateSession(sessionID);
	cookies.delete('credentials');

	return new Response(JSON.stringify({ status: 200 }));
}
