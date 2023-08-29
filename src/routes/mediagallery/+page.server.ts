import { PUBLIC_MEDIA_FOLDER } from '$env/static/public';
import fs from 'fs/promises';
import path from 'path';
import { redirect } from '@sveltejs/kit';
import { auth } from '../api/db';
import { validate } from '@src/utils/utils';
import { SESSION_COOKIE_NAME } from 'lucia-auth';

import { roles } from '@src/collections/Auth';

function hasFilePermission(user: any, file: string): boolean {
	const { role, username } = user;
	if (role === roles.admin) {
		return true;
	} else if (role === 'member' && file.startsWith(username)) {
		return true;
	}
	return false;
}

export async function load(event: any) {
	// Secure this page
	const session = event.cookies.get(SESSION_COOKIE_NAME) as string;
	const user = await validate(auth, session);
	if (user.status !== 200) {
		throw redirect(302, `/login`);
	}

	const mediaDir = path.resolve(PUBLIC_MEDIA_FOLDER);
	const files = await getFilesRecursively(mediaDir);

	const imageExtensions = ['.jpeg', '.jpg', '.png', '.webp', '.avif', '.tiff', '.svg'];
	const imageFiles = files.filter((file) =>
		imageExtensions.includes(path.extname(file).toLowerCase())
	);

	const uniqueImageFiles = Array.from(new Set(imageFiles)); // Remove duplicates

	const mediaData = await Promise.all(
		uniqueImageFiles.map(async (file) => {
			const filePath = `${PUBLIC_MEDIA_FOLDER}/${file}`;
			const fileName = path.basename(file);
			//console.log('Processing file:', fileName);

			const parts = fileName.split('-');
			const hash = parts[0];
			const imageName = parts.slice(1).join('-');
			//console.log('Hash:', hash);
			//console.log('Image Name:', imageName);

			const hasPermission = hasFilePermission(user, file);

			return {
				image: { path: imageName },
				name: imageName,
				size: await getFileSize(filePath),
				thumbnail: filePath,
				hash: hash,
				path: `/${hash}`
			};
		})
	);

	const officeExtensions = ['.docx', '.xlsx', '.pptx', '.pdf', '.svg'];
	const officeDocuments = files.filter((file) =>
		officeExtensions.includes(path.extname(file).toLowerCase())
	);

	const officeDocumentData = await Promise.all(
		officeDocuments.map(async (file) => {
			const filePath = path.join(PUBLIC_MEDIA_FOLDER, file);
			const fileExt = path.extname(file).toLowerCase();

			let thumbnail = '';
			// TODO: office icons not working
			if (fileExt === '.docx') {
				thumbnail = 'vscode-icons:file-type-word';
			} else if (fileExt === '.xlsx') {
				thumbnail = 'vscode-icons:file-type-excel';
			} else if (fileExt === '.pptx') {
				thumbnail = 'vscode-icons:file-type-powerpoint';
			}
			// TODO: replace with first page pdfthumbail
			else if (fileExt === '.pdf') {
				thumbnail = 'vscode-icons:file-type-pdf2';
			} else if (fileExt === '.svg') {
				const svgContent = await fs.readFile(filePath, 'utf-8');
				thumbnail = svgContent;
			}

			const hasPermission = hasFilePermission(user, file);

			return {
				path: filePath,
				name: path.basename(file),
				size: await getFileSize(filePath),
				thumbnail: thumbnail,
				hasPermission: hasPermission,
				properties: getOfficeDocumentProperties(filePath)
			};
		})
	);

	// console.log('mediaData:', mediaData);
	// console.log('officeDocumentData:', officeDocumentData);

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

function getOfficeDocumentProperties(filePath: string): any {
	// Get the file properties using the appropriate library (e.g., Office for Mac, LibreOffice)
	return {};
}
