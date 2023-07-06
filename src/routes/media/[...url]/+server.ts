// This code will upload the file to the `mediafiles` folder,
// convert it to the AVIF file format, rename the filename,
// create a thumbnail, and save to `mediathumbnails` folder.
// It will then return the thumbnail image and the optimized file data fom mediafile to the client.

// TODO Handle Thumbnail generation for PDF and other office documents

import { PUBLIC_MEDIA_OUTPUT_FORMAT } from '$env/static/public';
//console.log(PUBLIC_MEDIA_OUTPUT_FORMAT);
import type { RequestHandler } from '@sveltejs/kit';
import fs from 'fs';
import mime from 'mime-types';
import sharp from 'sharp';
import { error } from '@sveltejs/kit';

// handles POST requests for multiple mediafiles files
export const GET: RequestHandler = async ({ params }) => {
	try {
		if (!params.url) {
			throw error(400, 'Bad request');
		}
		const data = await fs.promises.readFile(`./mediafiles/${params.url}`);
		return new Response(data, {
			headers: {
				'Content-Type': mime.lookup(params.url) as string
			}
		});
	} catch (err: any) {
		console.error(err);
		if (err.code === 'ENOENT') {
			throw error(404, 'File not found');
		} else if (err.code === 'EACCES') {
			throw error(403, 'Access denied');
		} else if (err.code === 'ERR_FS_FILE_TOO_LARGE') {
			throw error(413, 'File too large');
		} else if (err.code === 'EMFILE') {
			throw error(500, 'Too many open files');
		} else if (err.code === 'EBUSY') {
			throw error(500, 'Resource busy or locked');
		} else {
			throw error(500, 'Internal server error');
		}
	}
};

// handles POST requests for multiple mediathumbnail files
export const _getMediaThumbnail: RequestHandler = async ({ params }) => {
	try {
		if (!params.url) {
			throw error(400, 'Bad request');
		}
		const data = await fs.promises.readFile(`./mediathumbnails/${params.url}`);
		return new Response(data, {
			headers: {
				'Content-Type': mime.lookup(params.url) as string
			}
		});
	} catch (err: any) {
		console.error(err);
		if (err.code === 'ENOENT') {
			throw error(404, 'File not found');
		} else if (err.code === 'EACCES') {
			throw error(403, 'Access denied');
		} else if (err.code === 'ERR_FS_FILE_TOO_LARGE') {
			throw error(413, 'File too large');
		} else if (err.code === 'EMFILE') {
			throw error(500, 'Too many open files');
		} else if (err.code === 'EBUSY') {
			throw error(500, 'Resource busy or locked');
		} else {
			throw error(500, 'Internal server error');
		}
	}
};

// handles POST requests for multiple media files
export const POST: RequestHandler = async ({ request, params }) => {
	try {
		// Server limits
		let outputFormat = PUBLIC_MEDIA_OUTPUT_FORMAT; // defines outputFormat for storage
		const MAX_FILE_SIZE = 100 * 1024 * 1024; // Set a file size limit 100 MB

		// Parse form data
		const formData = await request.formData();
		const files = formData.getAll('file') as File[];

		// Create folder if don't exist
		await fs.promises.mkdir(`./mediafiles/${params.url}`, { recursive: true });
		await fs.promises.mkdir(`./mediathumbnails/${params.url}`, { recursive: true });

		for (const file of files) {
			const fileData = await file.arrayBuffer();

			// Clean up filename
			const sanitizedUrl = file.name.replace(/[^a-zA-Z0-9_. ()]/g, '');
			const mimeType = mime.lookup(sanitizedUrl) as string;

			// Check if the file size exceeds the limit
			if (fileData.byteLength > MAX_FILE_SIZE) {
				return new Response('File size exceeds limit', { status: 413 });
			}

			// Check if the file type is supported
			const supportedMimeTypes = [
				'image/',
				'application/pdf',
				'image/svg+xml',
				'application/msword',
				'application/vnd.ms-excel',
				'application/vnd.ms-powerpoint'
			];
			if (!supportedMimeTypes.some((type) => mimeType.startsWith(type))) {
				return new Response('Unsupported file type', { status: 415 });
			}

			// Check if file already exists & return existing file
			const filePath = `./mediafiles/${params.url}/${sanitizedUrl.replace(/\.[^/.]+$/, '')}.avif`;
			if (fs.existsSync(filePath) && request.headers.get('X-Overwrite') !== 'true') {
				const fileData = await fs.promises.readFile(filePath);
				const thumbnailData = await fs.promises.readFile(`./mediathumbnails/${params.url}/${sanitizedUrl.replace(/\.[^/.]+$/, '')}.avif`);

				return new Response(
					JSON.stringify({
						error: 'File already exists',
						name: sanitizedUrl.replace(/\.[^/.]+$/, '') + '.avif',
						size: fileData.length,
						type: 'image/avif',
						data: fileData.toString('base64'),
						thumbnailData: thumbnailData.toString('base64')
					}),
					{
						headers: {
							'Content-Type': 'application/json'
						},
						status: 200
					}
				);
			}

			let optimizedData: any;
			let thumbnailData: any;

			if (mimeType.startsWith('image/')) {
				// save optimized image file and autorotate
				if (outputFormat === 'avif') {
					optimizedData = await sharp(Buffer.from(fileData)).rotate().avif({ quality: 50 }).toBuffer();
					await fs.promises.writeFile(`./mediafiles/${params.url}/${sanitizedUrl.replace(/\.[^/.]+$/, '')}.avif`, optimizedData);
				} else if (outputFormat === 'webp') {
					optimizedData = await sharp(Buffer.from(fileData)).rotate().webp({ quality: 80 }).toBuffer();
					await fs.promises.writeFile(`./mediafiles/${params.url}/${sanitizedUrl.replace(/\.[^/.]+$/, '')}.webp`, optimizedData);
				} else {
					await fs.promises.writeFile(`./mediafiles/${params.url}/${sanitizedUrl}`, Buffer.from(fileData));
				}

				// save optimized image as thumbnail and autorotate
				if (outputFormat === 'avif') {
					thumbnailData = await sharp(Buffer.from(fileData)).rotate().resize(400).avif({ quality: 50 }).toBuffer();
					await fs.promises.writeFile(`./mediathumbnails/${params.url}/${sanitizedUrl.replace(/\.[^/.]+$/, '')}.avif`, thumbnailData);
				} else if (outputFormat === 'webp') {
					thumbnailData = await sharp(Buffer.from(fileData)).rotate().resize(400).webp({ quality: 80 }).toBuffer();
					await fs.promises.writeFile(`./mediathumbnails/${params.url}/${sanitizedUrl.replace(/\.[^/.]+$/, '')}.webp`, thumbnailData);
				} else {
					thumbnailData = await sharp(Buffer.from(fileData)).rotate().resize(400).toBuffer();
					await fs.promises.writeFile(`./mediathumbnails/${params.url}/${sanitizedUrl}`, thumbnailData);
				}

				return new Response(
					JSON.stringify({
						name: `${sanitizedUrl.replace(/\.[^/.]+$/, '')}.${outputFormat}`,
						size: optimizedData.byteLength,
						type: `image/${outputFormat}`,
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
		}
		return new Response('No files uploaded', { status: 400 });
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
	console.log('params.url:', params.url);

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
