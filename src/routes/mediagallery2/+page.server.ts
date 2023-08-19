import { PUBLIC_MEDIA_FOLDER } from '$env/static/public';
import fs from 'fs';
import path from 'path';
import { redirect } from '@sveltejs/kit';
import { auth } from '../api/db';
import { validate } from '@src/utils/utils';
import { SESSION_COOKIE_NAME } from 'lucia-auth';

export async function load(event: any) {
	// Check if media files directory exists
	const mediaDir = path.resolve(PUBLIC_MEDIA_FOLDER);
	const mediaDirExists = fs.existsSync(mediaDir);

	if (!mediaDirExists) {
		return {
			props: {
				errorMessage: 'Media files directory not found'
			}
		};
	}

	// Recursively read the contents of the media files folder and its subdirectories
	const files = await getFilesRecursively(mediaDir);

	// Filter out non-image files
	const imageFiles = files.filter((file) => {
		const fileExt = path.extname(file).toLowerCase();
		return ['.jpeg', '.jpg', '.png', '.webp', '.avif', '.tiff', '.svg'].includes(fileExt);
	});

	// Construct URLs for the image files
	const mediaData = imageFiles.map((file) => {
		const filePath = `${PUBLIC_MEDIA_FOLDER}/${file}`;
		return {
			path: filePath,
			name: path.basename(file) // Get the file name
			//size: getFileSize(filePath) // Get the file size (you'll need to implement getFileSize)

			// Add other attributes as needed
		};
	});

	// Lucia Auth security check
	const session = event.cookies.get(SESSION_COOKIE_NAME) as string;
	const user = await validate(auth, session);
	if (user.status !== 200) {
		throw redirect(302, `/login`);
	}

	console.log('mediaData:', mediaData);

	return {
		props: {
			data: mediaData // Pass the media data to the Svelte componentimageUrls
		}
	};
}

async function getFilesRecursively(dir: string): Promise<string[]> {
	let files: string[] = [];
	const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
	for (const dirent of dirents) {
		const res = path.resolve(dir, dirent.name);
		if (dirent.isDirectory()) {
			files = [...files, ...(await getFilesRecursively(res))];
		} else {
			files.push(path.relative(PUBLIC_MEDIA_FOLDER, res));
		}
	}
	return files;
}
function getFileSize(filePath: string): any {
	throw new Error('Function not implemented.');
}

function getThumbnailUrl(filePath: string): any {
	throw new Error('Function not implemented.');
}
