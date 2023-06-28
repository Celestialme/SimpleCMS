// This code will upload the file to the `mediafiles` folder,
// convert it to the AVIF file format, rename the filename,
// create a thumbnail, and save to `mediathumbnails` folder.
// It will then return the thumbnail image and the optimized file data fom mediafile to the client.

import type { RequestHandler } from '@sveltejs/kit';
import fs from 'fs';
import mime from 'mime-types';
import sharp from 'sharp';

// handles POST requests for media files
export const POST: RequestHandler = async ({ request }) => {
	try {
		//parse form data
		const formData = await request.formData();
		const file = formData.get('file') as File;
		const fileData = await file.arrayBuffer();

		//create folder if dont exist
		await fs.promises.mkdir('./mediafiles', { recursive: true });
		await fs.promises.mkdir('./mediathumbnails', { recursive: true });

		//clean up filename
		const sanitizedUrl = file.name.replace(/[^a-zA-Z0-9_. ()]/g, '');
		const mimeType = mime.lookup(sanitizedUrl) as string;

		// Check if file already exists
		const filePath = `./mediafiles/${sanitizedUrl.replace(/\.[^/.]+$/, '')}.avif`;
		if (fs.existsSync(filePath)) {
			return new Response('File already exists', { status: 400 });
		}

		let outputFormat = 'avif'; // set the default output format to AVIF

		let optimizedData;
		let thumbnailData;

		if (mimeType.startsWith('image/')) {
			// save optimized image file and autorotate
			if (outputFormat === 'avif') {
				optimizedData = await sharp(Buffer.from(fileData)).rotate().avif().toBuffer();
				await fs.promises.writeFile(`./mediafiles/${sanitizedUrl.replace(/\.[^/.]+$/, '')}.avif`, optimizedData);
			} else if (outputFormat === 'webp') {
				optimizedData = await sharp(Buffer.from(fileData)).rotate().webp().toBuffer();
				await fs.promises.writeFile(`./mediafiles/${sanitizedUrl.replace(/\.[^/.]+$/, '')}.webp`, optimizedData);
			} else {
				await fs.promises.writeFile(`./mediafiles/${sanitizedUrl}`, fileData);
			}

			// save optimized image as thumbnail and autorotate
			thumbnailData = await sharp(Buffer.from(fileData)).rotate().resize(400).toBuffer();
			await fs.promises.writeFile(`./mediathumbnails/${sanitizedUrl.replace(/\.[^/.]+$/, '')}.avif`, thumbnailData);

			return new Response(
				JSON.stringify({
					name: `${sanitizedUrl.replace(/\.[^/.]+$/, '')}.avif`,
					size: optimizedData.byteLength,
					type: 'image/avif',
					data: optimizedData.toString('base64'),
					thumbnailData: thumbnailData.toString('base64')
				}),
				{ headers: { 'Content-Type': 'application/json' } }
			);
		} else {
			return new Response(Buffer.from(fileData), {
				headers: {
					'Content-Type': mimeType
				}
			});
		}
	} catch (error) {
		console.error(error);
		if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
			return new Response('File not found', { status: 404 });
		} else {
			return new Response((error as Error).message, { status: 500 });
		}
	}
};
// this function gets call to check trash for files older than 30 day
// and REALLY delete these expired files
async function deleteExpiredTrashFiles() {
	const trashFiles = await fs.promises.readdir('./trash', { withFileTypes: true });
	const now = new Date();

	for (const file of trashFiles) {
		if (file.isFile()) {
			const [filename, timestamp] = file.name.split('-');
			const fileDate = new Date(timestamp);

			const daysSinceMovedToTrash = Math.round((now.getTime() - fileDate.getTime()) / (1000 * 60 * 60 * 24));
			if (daysSinceMovedToTrash > 30) {
				await fs.promises.unlink(`./trash/${file.name}`);
			}
		}
	}
}

// handles DELETE requests for mediafiles & mediathumbnails
// the files get a timestamp and get moved to trash folder before really deleting them
export const DELETE: RequestHandler = async ({ params }) => {
	try {
		if (!params.url || !Array.isArray(params.url)) {
			return new Response('Missing or invalid URL parameter', { status: 400 });
		}

		const subdirectory = params.url.slice(0, -1).join('/');
		const filename = params.url[params.url.length - 1];

		await fs.promises.mkdir(`./trash/${subdirectory}`, { recursive: true });
		await fs.promises.rename(`./mediafiles/${subdirectory}/${filename}`, `./trash/${subdirectory}/${filename}-${new Date().toISOString()}`);
		await fs.promises.rename(`./mediathumbnails/${subdirectory}/${filename}`, `./trash/${subdirectory}/${filename}-${new Date().toISOString()}`);

		const mediaFiles = await fs.promises.readdir(`./mediafiles/${subdirectory}`);
		if (mediaFiles.length === 0) {
			await fs.promises.rmdir(`./mediafiles/${subdirectory}`);
		}

		const thumbnailFiles = await fs.promises.readdir(`./mediathumbnails/${subdirectory}`);
		if (thumbnailFiles.length === 0) {
			await fs.promises.rmdir(`./mediathumbnails/${subdirectory}`);
		}

		await deleteExpiredTrashFiles();

		return new Response(null, { status: 204 });
	} catch (error) {
		console.error(error);
		if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
			return new Response('File not found', { status: 404 });
		} else {
			return new Response((error as Error).message, { status: 500 });
		}
	}
};
