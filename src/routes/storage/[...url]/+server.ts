import type { RequestHandler } from './$types';
import fs from 'fs';
import mime from 'mime-types';
import publicConfig from '@root/config/public';

export const GET: RequestHandler = async ({ params }) => {
	const data = await fs.promises.readFile(`./${publicConfig.STORAGE_FOLDER}/${params.url}`);
	return new Response(data, {
		headers: {
			'Content-Type': mime.lookup(params.url) as string
		}
	});
};
