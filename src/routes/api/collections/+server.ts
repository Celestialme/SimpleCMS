import type { RequestHandler } from './$types';
import { collections } from '@src/routes/api/db';
import fs from 'fs';
export const GET: RequestHandler = async () => {
	let files = fs.readdirSync('src/collections').filter((x) => !['index.ts', 'types.ts', 'Auth.ts', 'config.ts'].includes(x));
	return new Response(JSON.stringify(files));
};
