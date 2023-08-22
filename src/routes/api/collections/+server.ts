import type { RequestHandler } from './$types';
import { getCollections } from './getCollections';
export const GET: RequestHandler = async () => {
	let imports = getCollections();
	return new Response(JSON.stringify(imports));
};
