import { redirect } from '@sveltejs/kit';
import { auth } from '../api/db';
import { validate } from '@src/utils/utils';
import { SESSION_COOKIE_NAME } from 'lucia-auth';

import { PUBLIC_MEDIA_FOLDER } from '$env/static/public';

import fs from 'fs';
import path from 'path';

export async function load(event) {
	// Get the session cookie
	const session = event.cookies.get(SESSION_COOKIE_NAME) as string;
	// Validate the user's session
	const user = await validate(auth, session);
	// If the user is not authenticated, redirect to the login page
	if (user.status !== 200) {
		throw redirect(302, `/login`);
	}

	// Check if there are any collections in the specified directory
	const collectionsDir = path.resolve('src/collections');
	const files = fs.readdirSync(collectionsDir);

	const hasCollections = files.some((file) => file.endsWith('.ts'));

	// Check if media files directory exists
	const mediaDir = path.resolve(PUBLIC_MEDIA_FOLDER);
	console.log('mediaDir:', mediaDir);

	const mediaDirExists = fs.existsSync(mediaDir);
	console.log('mediaDirExists', mediaDirExists); // true or false

	if (!fs.existsSync(mediaDir)) {
		// If it doesn't exist, return an error message
		return {
			props: {
				error: { message: 'Media files directory not found' }
			}
		};
	}

	// Check if media files cached directory exists
	const cachedDir = path.resolve(mediaDir, 'thumbnails');
	console.log('cachedDir:', cachedDir);
	const cachedDirExists = fs.existsSync(cachedDir);
	console.log('cachedDirExists', cachedDirExists); // true or false

	if (!fs.existsSync(cachedDir)) {
		// If it doesn't exist, create it
		fs.mkdirSync(cachedDir, { recursive: true });
	}

	console.log('User', user);
	console.log('Event:', event);
	console.log('PUBLIC_MEDIA_FOLDER:', PUBLIC_MEDIA_FOLDER);

	// Define a function to get all files from the media files folder
	function getAllFilesFromMediaFilesFolder() {
		// Read the contents of the media files folder
		const files = fs.readdirSync(mediaDir);

		// Map the file names to objects representing the media files
		const mediaFiles = files.map((file) => {
			return {
				name: file,
				path: path.join(mediaDir, file)
			};
		});

		return mediaFiles;
	}

	// Call getAllFilesFromMediaFilesFolder to get the data
	const data = getAllFilesFromMediaFilesFolder();

	// Check if there are any media files in the specified directory
	const hasMediaFiles = data.length > 0;

	let errorMessage = '';
	if (!hasMediaFiles) {
		errorMessage = 'No media files found.';
	}

	// TODO: Add user permission check
	const hasPermission = true;

	let props = {
		hasCollections,
		hasMediaFiles,
		errorMessage,
		hasPermission,
		data
	};

	console.log('props', props);

	return {
		props
	};
}
