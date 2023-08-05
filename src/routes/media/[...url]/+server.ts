import type { RequestHandler } from './$types';
import fs from 'fs';
import mime from 'mime-types';
import { PUBLIC_MEDIA_FOLDER } from '$env/static/public';
export const GET: RequestHandler = async ({ params }) => {
	const data = await fs.promises.readFile(`./${PUBLIC_MEDIA_FOLDER}/${params.url}`);
	return new Response(data, {
		headers: {
			'Content-Type': mime.lookup(params.url) as string
		}
	});
};
