import type { RequestHandler } from '../$types';
import fs from 'fs';
export const GET: RequestHandler = async ({ params }) => {
	const data = await fs.promises.readFile(`./media/${params.url}`);
	return new Response(data);
};
