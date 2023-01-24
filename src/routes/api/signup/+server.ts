import type { RequestHandler } from './$types';
import { auth } from '@src/routes/api/db';
export const POST: RequestHandler = async ({ request }) => {
	let formData = await request.formData();
	let user = await auth
		.createUser('email', formData.get('email') as string, {
			password: formData.get('password') as string,
			attributes: {
				username: 'Admin'
			}
		})
		.catch(() => null);
	console.log(user);
	if (!user) return new Response(JSON.stringify({ status: 404 }));
	const session = await auth.createSession(user.userId);
	return new Response(
		JSON.stringify({ user: user.username, session: session.sessionId, status: 200 })
	);
};
