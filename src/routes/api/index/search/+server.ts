import { auth } from '@src/routes/api/db';
import { SESSION_COOKIE_NAME } from '@src/auth';
import type { User } from '@src/auth/types';
import { spawn } from 'child_process';
import { indexer } from '@src/stores/load.js';
export const POST = async ({ request, locals }) => {
	let process = indexer;
	if (!process || process.exitCode) {
		process = spawn('main.exe');
	}
	let data = await request.formData();

	let search_text = data.get('search_text') as string;

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
