// This code will upload the file to the `mediafiles` folder,
// convert it to the AVIF file format, rename the filename,
// create a thumbnail, and save to `mediathumbnails` folder.
// It will then return the thumbnail image and the optimized file data fom mediafile to the client.

// TODO Handle Thumbnail generation for PDF and other office documents

import type { RequestHandler } from './$types';
import fs from 'fs';
import mime from 'mime-types';
import { error } from '@sveltejs/kit';

// import sharp from 'sharp';

// TODO : Test PUBLIC_MEDIASERVER_URL Function
// handles GET requests for multiple mediafiles files
const PUBLIC_MEDIA_FOLDER = process.env.PUBLIC_MEDIA_FOLDER;
const PUBLIC_MEDIASERVER_URL = process.env.PUBLIC_MEDIASERVER_URL;

// handles GET requests for multiple mediafiles files
export const GET: RequestHandler = async ({ params }) => {
	try {
		if (!params.url) {
			return new Response('Bad request', { status: 400 });
		}
		if (PUBLIC_MEDIASERVER_URL) {
			return new Response(null, {
				status: 302,
				headers: {
					location: `${PUBLIC_MEDIASERVER_URL}/${params.url}`
				}
			});
		} else {
			const data = await fs.promises.readFile(`${PUBLIC_MEDIA_FOLDER}/${params.url}`);
			return new Response(data, {
				headers: {
					'Content-Type': mime.lookup(params.url) as string
				}
			});
		}
	} catch (err: any) {
		console.error(err);
		if (err.code === 'ENOENT') {
			return new Response('File not found', { status: 404 });
		} else if (err.code === 'EACCES') {
			return new Response('Access denied', { status: 403 });
		} else if (err.code === 'ERR_FS_FILE_TOO_LARGE') {
			return new Response('File too large', { status: 413 });
		} else if (err.code === 'EMFILE') {
			return new Response('Too many open files', { status: 500 });
		} else if (err.code === 'EBUSY') {
			return new Response('Resource busy or locked', { status: 500 });
		} else {
			return new Response('Internal server error', { status: 500 });
		}
	}
};

// handles POST requests for multiple mediafiles files
// export const POST: RequestHandler = async ({ request, params }) => {
// 	try {
// 		// Server limits
// 		let outputFormat = PUBLIC_MEDIA_OUTPUT_FORMAT; // defines outputFormat for storage
// 		const MAX_FILE_SIZE = 100 * 1024 * 1024; // Set a file size limit 100 MB

// 		// Parse form data
// 		const formData = await request.formData();
// 		const files = formData.getAll('file') as File[];

// 		// Create folder if don't exist
// 		await fs.promises.mkdir(`./mediafiles/${params.url}`, { recursive: true });
// 		await fs.promises.mkdir(`./mediafiles/${params.url}/thumbnails`, { recursive: true });

// 		for (const file of files) {
// 			const fileData = await file.arrayBuffer();

// 			// Clean up filename
// 			const sanitizedUrl = file.name.replace(/[^a-zA-Z0-9_. ()]/g, '');
// 			const mimeType = mime.contentType(sanitizedUrl) as string;

// 			// Check if the file size exceeds the limit
// 			if (fileData.byteLength > MAX_FILE_SIZE) {
// 				return new Response('File size exceeds limit', { status: 413 });
// 			}

// 			// Check if the file type is supported
// 			const supportedMimeTypes = [
// 				'image/',
// 				'application/pdf',
// 				'image/svg+xml',
// 				'application/msword',
// 				'application/vnd.ms-excel',
// 				'application/vnd.ms-powerpoint'
// 			];
// 			if (!supportedMimeTypes.some((type) => mimeType.startsWith(type))) {
// 				return new Response('Unsupported file type', { status: 415 });
// 			}

// 			// Check if file already exists & return existing file
// 			const filePath = `./mediafiles/${params.url}/${sanitizedUrl.replace(/\.[^/.]+$/, '')}.avif`;
// 			try {
// 				await fs.promises.access(filePath);
// 				if (request.headers.get('X-Overwrite') !== 'true') {
// 					const fileData = await fs.promises.readFile(filePath);
// 					const thumbnailData = await fs.promises.readFile(`./mediafiles/${params.url}/thumbnails/${sanitizedUrl.replace(/\.[^/.]+$/, '')}.avif`);

// 					return new Response(
// 						fileData, // remove base64 conversion here
// 						{
// 							headers: {
// 								'Content-Type': mimeType // change content type here
// 							},
// 							status: 200
// 						}
// 					);
// 				}
// 			} catch (err) {
// 				// file does not exist, continue processing
// 			}

// 			let optimizedData: any;
// 			let thumbnailData: any;

// 			if (mimeType.startsWith('image/')) {
// 				// save optimized image file and autorotate
// 				switch (outputFormat) {
// 					case 'avif':
// 						optimizedData = await sharp(Buffer.from(fileData)).rotate().avif({ quality: 50 }).toBuffer();
// 						await fs.promises.writeFile(`./mediafiles/${params.url}/${sanitizedUrl.replace(/\.[^/.]+$/, '')}.avif`, optimizedData);
// 						break;
// 					case 'webp':
// 						optimizedData = await sharp(Buffer.from(fileData)).rotate().webp({ quality: 80 }).toBuffer();
// 						await fs.promises.writeFile(`./mediafiles/${params.url}/${sanitizedUrl.replace(/\.[^/.]+$/, '')}.webp`, optimizedData);
// 						break;
// 					default:
// 						await fs.promises.writeFile(`./mediafiles/${params.url}/${sanitizedUrl}`, Buffer.from(fileData));
// 				}

// 				// save optimized image as thumbnail and autorotate
// 				switch (outputFormat) {
// 					case 'avif':
// 						thumbnailData = await sharp(Buffer.from(fileData)).rotate().resize(400).avif({ quality: 50 }).toBuffer();
// 						await fs.promises.writeFile(`./mediafiles/${params.url}/thumbnails/${sanitizedUrl.replace(/\.[^/.]+$/, '')}.avif`, thumbnailData);
// 						break;
// 					case 'webp':
// 						thumbnailData = await sharp(Buffer.from(fileData)).rotate().resize(400).webp({ quality: 80 }).toBuffer();
// 						await fs.promises.writeFile(`./mediafiles/${params.url}/thumbnails/${sanitizedUrl.replace(/\.[^/.]+$/, '')}.webp`, thumbnailData);
// 						break;
// 					default:
// 						thumbnailData = await sharp(Buffer.from(fileData)).rotate().resize(400).toBuffer();
// 						await fs.promises.writeFile(`./mediafiles/${params.url}/thumbnails/${sanitizedUrl}`, thumbnailData);
// 				}

// 				return new Response(
// 					optimizedData, // remove base64 conversion here
// 					{
// 						headers: {
// 							'Content-Type': mimeType // change content type here
// 						},
// 						status: 200
// 					}
// 				);
// 			} else {
// 				await fs.promises.writeFile(`./mediafiles/${params.url}/${sanitizedUrl}`, Buffer.from(fileData));
// 				return new Response(
// 					fileData, // remove base64 conversion here
// 					{
// 						headers: {
// 							'Content-Type': mimeType // change content type here
// 						},
// 						status: 200
// 					}
// 				);
// 			}
// 		}
// 	} catch (err) {
// 		console.error(err);
// 		return new Response('Internal server error', { status: 500 });
// 	}

// 	return new Response('No files uploaded', { status: 400 });
// };

// this function gets call to check trash for files older than 30 day
// and REALLY delete these expired files
// async function deleteExpiredTrashFiles() {
// 	const trashFiles = await fs.promises.readdir('./trash', { withFileTypes: true });
// 	const now = new Date();

// 	for (const file of trashFiles) {
// 		if (file.isFile()) {
// 			const [filename, timestamp] = file.name.split('-');
// 			const fileDate = new Date(timestamp);

// 			const daysSinceMovedToTrash = Math.round((now.getTime() - fileDate.getTime()) / (1000 * 60 * 60 * 24));
// 			if (daysSinceMovedToTrash > 30) {
// 				await fs.promises.unlink(`./trash/${file.name}`);
// 			}
// 		}
// 	}
// }

// handles DELETE requests for mediafiles & mediathumbnails
// the files get a timestamp and get moved to trash folder before really deleting them
// export const DELETE: RequestHandler = async ({ params }) => {
// 	console.log('params.url:', params.url);

// 	try {
// 		if (!params.url || !Array.isArray(params.url)) {
// 			return new Response('Missing or invalid URL parameter', { status: 400 });
// 		}

// 		const subdirectory = params.url.slice(0, -1).join('/');
// 		const filename = params.url[params.url.length - 1];

// 		await fs.promises.mkdir(`./trash/${subdirectory}`, { recursive: true });
// 		await fs.promises.rename(`./mediafiles/${subdirectory}/${filename}`, `./trash/${subdirectory}/${filename}-${new Date().toISOString()}`);
// 		await fs.promises.rename(
// 			`./mediafiles/${subdirectory}/thumbnails/${filename}`,
// 			`./trash/${subdirectory}/thumbnails/${filename}-${new Date().toISOString()}`
// 		); // change the path here

// 		const mediaFiles = await fs.promises.readdir(`./mediafiles/${subdirectory}`);
// 		if (mediaFiles.length === 0) {
// 			await fs.promises.rmdir(`./mediafiles/${subdirectory}`);
// 		}

// 		const thumbnailFiles = await fs.promises.readdir(`./mediafiles/${subdirectory}/thumbnails`); // change the path here
// 		if (thumbnailFiles.length === 0) {
// 			await fs.promises.rmdir(`./mediafiles/${subdirectory}/thumbnails`); // change the path here
// 		}

// 		await deleteExpiredTrashFiles();

// 		return new Response(null, { status: 204 });
// 	} catch (error) {
// 		console.error(error);
// 		if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
// 			return new Response('File not found', { status: 404 });
// 		} else {
// 			return new Response((error as Error).message, { status: 500 });
// 		}
// 	}
// };
