import { auth } from '@src/routes/api/db';
import { SESSION_COOKIE_NAME } from '@src/auth';
import type { User } from '@src/auth/types';
import { spawn, type ChildProcessWithoutNullStreams } from 'child_process';
import axios from 'axios';
import { indexer } from '@src/stores/load.js';
export const POST = async ({ cookies, request }) => {
	if (!indexer || (indexer as ChildProcessWithoutNullStreams).exitCode) {
		spawn('main.exe');
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
	let res = (await axios.post('http://localhost:8000', { search_text })).data;
	return new Response(JSON.stringify(res), { status: 200 });
};
