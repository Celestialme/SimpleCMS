import { redirect } from '@sveltejs/kit';
import { auth } from '../api/db';
import { validate } from '@src/utils/utils';
import { SESSION_COOKIE_NAME } from 'lucia-auth';

import { PUBLIC_MEDIA_FOLDER } from '$env/static/public';
//console.log('PUBLIC_MEDIA_FOLDER:', PUBLIC_MEDIA_FOLDER);

import fs from 'fs';
import path from 'path';

// Move the function outside the load function so it can be accessed from the Svelte component
async function getAllFilesFromMediaFilesFolder(mediaDir, user) {
	// Read the contents of the media files folder
	const files = await fs.promises.readdir(mediaDir);

	// Map the file names to objects representing the media files
	const mediaFiles = files.map((file) => {
		const filePath = path.join(mediaDir, file);
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

		// Check if the user has permission to view this media file based on their role
		let hasPermission = false;
		if (user.role === 'admin') {
			// If the user is an admin, they have permission to view all media files
			hasPermission = true;
		} else if (user.role === 'member' && file.startsWith(user.username)) {
			// If the user is a member and the file name starts with their username, they have permission to view this media file
			hasPermission = true;
		}

		return {
			image: `${PUBLIC_MEDIA_FOLDER}/${file}`,
			name: file,
			path: `${PUBLIC_MEDIA_FOLDER}`,
			thumbnail,
			hasPermission
		};
	});

	return mediaFiles;
}

export async function load(event: any, query: any) {
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

	// Check if media files directory exists
	const mediaDir = path.resolve(PUBLIC_MEDIA_FOLDER);
	//console.log('mediaDir:', mediaDir);

	const mediaDirExists = fs.existsSync(mediaDir);
	//console.log('mediaDirExists', mediaDirExists); // true or false

	// Check if media files cached directory exists
	const cachedDir = path.resolve(mediaDir, 'thumbnails');
	//console.log('cachedDir:', cachedDir);
	const cachedDirExists = fs.existsSync(cachedDir);
	//console.log('cachedDirExists', cachedDirExists); // true or false

	if (!mediaDirExists) {
		// If it doesn't exist, return an error message
		return {
			props: {
				errorMessage: 'Media files directory not found'
			}
		};
	}

	if (!cachedDirExists) {
		// If it doesn't exist, create it
		fs.mkdirSync(cachedDir, { recursive: true });
	}

	// console.log('User', user);
	// console.log('Event:', event);
	// console.log('PUBLIC_MEDIA_FOLDER:', PUBLIC_MEDIA_FOLDER);

	// Call getAllFilesFromMediaFilesFolder to get the data
	const data = mediaDirExists ? await getAllFilesFromMediaFilesFolder(mediaDir, user) : [];

	// Check if there are any media files in the specified directory
	let errorMessage = '';
	if (data.length === 0) {
		errorMessage = 'No media files found.';
	}

	// Get the search query and page from the query parameters
	const searchQuery = query.get('search') || '';
	const currentPage = parseInt(query.get('page')) || 1;
	const itemsPerPage = 10; // Number of items per page

	// Call getAllFilesFromMediaFilesFolder to get the data
	const mediaFiles = mediaDirExists ? await getAllFilesFromMediaFilesFolder(mediaDir, user) : [];

	// Filter the media files based on the search query
	const filteredMediaFiles = mediaFiles.filter(
		(item) =>
			item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.path.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// Calculate pagination parameters
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const paginatedMediaFiles = filteredMediaFiles.slice(startIndex, endIndex);

	// Calculate total pages for pagination controls
	const totalPages = Math.ceil(filteredMediaFiles.length / itemsPerPage);

	return {
		props: {
			errorMessage,
			data: paginatedMediaFiles,
			totalPages,
			currentPage,
			currentSearch: searchQuery
		}
	};
}
