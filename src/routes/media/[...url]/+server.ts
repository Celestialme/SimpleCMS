import type { RequestHandler } from './$types';
import fs from 'fs';
import mime from 'mime-types';
import sharp from 'sharp';

//handles GET requests for media files
export const GET: RequestHandler = async ({ params }) => {
	try {
		await fs.promises.mkdir('./media', { recursive: true });
		const sanitizedUrl = params.url.replace(/[^a-zA-Z0-9_.]/g, '');
		const data = await fs.promises.readFile(`./media/${sanitizedUrl}`);
		const mimeType = mime.lookup(sanitizedUrl) as string;
		if (mimeType.startsWith('image/')) {
			const avifData = await sharp(data).avif().toBuffer();
			return new Response(avifData, {
				headers: {
					'Content-Type': 'image/avif'
				}
			});
		} else {
			return new Response(data, {
				headers: {
					'Content-Type': mimeType
				}
			});
		}
	} catch (error) {
		return new Response((error as Error).message, { status: 500 });
	}
};
