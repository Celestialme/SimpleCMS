import { auth } from '@src/routes/api/db';
import { SESSION_COOKIE_NAME } from '@src/auth';
import type { User } from '@src/auth/types';
import { spawn } from 'child_process';
import { indexer } from '@src/stores/load.js';
export const POST = async ({ cookies, request }) => {
	let process = indexer;
	if (!process || process.exitCode) {
		process = spawn('main.exe');
	}
	let session_id = cookies.get(SESSION_COOKIE_NAME) as string;
	let data = await request.formData();
	let user_id = data.get('user_id') as string;
	let user = user_id
		? ((await auth.checkUser({ _id: user_id })) as User)
		: ((await auth.validateSession(session_id)) as User);
	let search_text = data.get('search_text') as string;

	if (!user) {
		return new Response('', { status: 403 });
	}
	console.time('search');
	process.stdin.write(search_text + '\n');
	let res = await new Promise<string>((resolve, reject) => {
		let listener = process.stdout.once('data', (data) => {
			resolve(data.toString());
			listener.removeAllListeners();
			console.timeEnd('search');
		});
	});
	return new Response(res, { status: 200 });
};
