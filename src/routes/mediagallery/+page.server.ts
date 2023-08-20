import { PUBLIC_MEDIA_FOLDER } from '$env/static/public';
import fs from 'fs/promises';
import path from 'path';
import { redirect } from '@sveltejs/kit';
import { auth } from '../api/db';
import { validate } from '@src/utils/utils';
import { SESSION_COOKIE_NAME } from 'lucia-auth';

export async function load(event: any) {
	const mediaDir = path.resolve(PUBLIC_MEDIA_FOLDER);
	const files = await getFilesRecursively(mediaDir);

	const imageExtensions = ['.jpeg', '.jpg', '.png', '.webp', '.avif', '.tiff', '.svg'];
	const officeExtensions = ['.docx', '.xlsx', '.pptx'];

	const imageFiles = files.filter((file) =>
		imageExtensions.includes(path.extname(file).toLowerCase())
	);

	const mediaData = await Promise.all(
		imageFiles.map(async (file) => {
			const filePath = `${PUBLIC_MEDIA_FOLDER}/${file}`;
			return {
				path: filePath,
				name: path.basename(file),
				size: await getFileSize(filePath),
				dimensions: await getImageDimensions(filePath)
			};
		})
	);

	const officeDocuments = files.filter((file) =>
		officeExtensions.includes(path.extname(file).toLowerCase())
	);

	const officeDocumentData = officeDocuments.map((file) => {
		const filePath = `${PUBLIC_MEDIA_FOLDER}/${file}`;
		return {
			...mediaData[officeDocuments.indexOf(file)],
			properties: getOfficeDocumentProperties(filePath)
		};
	});

	const session = event.cookies.get(SESSION_COOKIE_NAME) as string;
	const user = await validate(auth, session);
	if (user.status !== 200) {
		throw redirect(302, `/login`);
	}

	console.log('mediaData:', mediaData);
	console.log('officeDocumentData:', officeDocumentData);

	return {
		props: {
			data: [...mediaData, ...officeDocumentData]
		}
	};
}

async function getFilesRecursively(dir: string): Promise<string[]> {
	let files: string[] = [];
	const dirents = await fs.readdir(dir, { withFileTypes: true });
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

async function getFileSize(filePath: string): Promise<number> {
	const fileStats = await fs.stat(filePath);
	return fileStats.size;
}

async function getImageDimensions(filePath: string): Promise<[number, number]> {
	// Implement your logic to get image dimensions asynchronously
	return [0, 0]; // Return default dimensions for now
}

function getOfficeDocumentProperties(filePath: string): any {
	// Get the file properties using the appropriate library (e.g., Office for Mac, LibreOffice)
	return {};
}
