import { spawn, type ChildProcessWithoutNullStreams } from 'child_process';
let process: ChildProcessWithoutNullStreams;
export const POST = async ({ request, locals }) => {
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
