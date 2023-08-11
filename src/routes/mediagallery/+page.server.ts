import { redirect } from '@sveltejs/kit';
import { auth } from '../api/db';
import { validate } from '@src/utils/utils';
import { SESSION_COOKIE_NAME } from 'lucia-auth';

import { PUBLIC_MEDIA_FOLDER } from '$env/static/public';

import fs from 'fs';
import path from 'path';

// Define a function to check if a directory exists and create it if it doesn't
function ensureDirectoryExists(dirPath: string) {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath);
	}
}
//TODO: Error 500 if no Folder exists
export async function load({ params, event }) {
	// TODO: Auth breaks media Gallery
	// Check if user has a valid session
	// let session = event.cookies.get(SESSION_COOKIE_NAME) as string;
	// let user = await validate(auth, session);
	// if (user.status !== 200) {
	// 	throw redirect(302, `/login`);
	// }
	try {
		// Check if media files directory exists
		//const mediaDir = path.resolve(PUBLIC_MEDIA_FOLDER);
		const mediaDir = path.resolve(PUBLIC_MEDIA_FOLDER);

		console.log(mediaDir);
		if (!fs.existsSync(mediaDir)) {
			// If it doesn't exist, return an error message
			return {
				status: 404,
				error: new Error('Media files directory not found')
			};
		}

		// Check if media files cached directory exists
		const cachedDir = path.resolve(`${PUBLIC_MEDIA_FOLDER}/thumbnails`);
		ensureDirectoryExists(cachedDir);

		const collections = fs.readdirSync(mediaDir);

		const images = collections.flatMap((item) => {
			const itemPath = path.join(mediaDir, item);
			const isDirectory = fs.statSync(itemPath).isDirectory();
			let files;

			if (isDirectory) {
				files = fs.readdirSync(itemPath).map((file) => ({
					file,
					collection: item
				}));
			} else {
				files = [{ file: item }];
			}

			return files.map((fileInfo) => {
				const { file, collection } = fileInfo;
				const filePath = path.join(mediaDir, collection || '', file);
				const fileExt = path.extname(filePath).toLowerCase();
				const fileName = path.parse(file).name;
				let thumbnail: any;

				if (['.jpeg', '.jpg', '.png', '.webp', '.avif', '.tiff'].includes(fileExt)) {
					const collectionDir = path.relative(mediaDir, path.dirname(filePath));
					thumbnail = `${PUBLIC_MEDIA_FOLDER}/thumbnails/${collectionDir}/${fileName}.avif`;
				} else if (fileExt === '.docx') {
					thumbnail = `<iconify-icon icon="vscode-icons:file-type-word"></iconify-icon>`;
				} else if (fileExt === '.xlsx') {
					thumbnail = `<iconify-icon icon="vscode-icons:file-type-excel"></iconify-icon>`;
				} else if (fileExt === '.pptx') {
					thumbnail = `<iconify-icon icon="vscode-icons:file-type-powerpoint"></iconify-icon>`;
				} else if (fileExt === '.pdf') {
					thumbnail = `<iconify-icon icon="vscode-icons:file-type-pdf2"></iconify-icon>`;
				} else if (fileExt === '.svg') {
					thumbnail = `${PUBLIC_MEDIA_FOLDER}/${file}`;
				}

				// TODO: Add user permission check
				const hasPermission = true;

				return {
					image: `${PUBLIC_MEDIA_FOLDER}/${collection || ''}/${file}`,
					name: file,
					path: `${PUBLIC_MEDIA_FOLDER}/${collection || ''}`,
					thumbnail,
					hasPermission
				};
			});
		});

		// Check if the images array is empty
		if (images.length === 0) {
			// If it is empty, return an error message
			return {
				status: 404,
				error: new Error('No images found')
			};
		}

		return {
			status: 200,
			body: images
		};
	} catch (error) {
		// Catch any errors that may occur and return an error message
		console.error(error);
		return {
			status: 500,
			error: new Error('Internal Server Error')
		};
	}
}
