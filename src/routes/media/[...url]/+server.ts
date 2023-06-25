import type { RequestHandler } from './$types';
import fs from 'fs';
import mime from 'mime-types';
import sharp from 'sharp';

//handles GET requests for media files
export const GET: RequestHandler = async ({ params }) => {
	try {
		//create folder if dont exist
		await fs.promises.mkdir('./mediafiles', { recursive: true });
		await fs.promises.mkdir('./mediafilescached', { recursive: true });

		//clean up filename
		const sanitizedUrl = params.url.replace(/[^a-zA-Z0-9_. ()]/g, '');
		const data = await fs.promises.readFile(`./mediafiles/${sanitizedUrl}`);
		const mimeType = mime.lookup(sanitizedUrl) as string;

		if (mimeType.startsWith('image/')) {
			// save optimized image file
			const avifData = await sharp(data).avif().toBuffer();
			await fs.promises.writeFile(`./mediafiles/${sanitizedUrl.replace(/\.[^/.]+$/, '')}.avif`, avifData);

			// save optimized image as thumbnail
			const thumbnailData = await sharp(data).resize(400).toBuffer();
			await fs.promises.writeFile(`./mediafilescached/${sanitizedUrl.replace(/\.[^/.]+$/, '')}.avif`, thumbnailData);

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
		if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
			return new Response('File not found', { status: 404 });
		} else {
			return new Response((error as Error).message, { status: 500 });
		}
	}
};
