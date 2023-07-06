import fs from 'fs';
import path from 'path';

// Define a function to check if a directory exists and create it if it doesn't
function ensureDirectoryExists(dirPath: string) {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath);
	}
}

export function load({ params }) {
	try {
		// Check if media files directory exists
		const mediaDir = path.resolve('./mediafiles');
		if (!fs.existsSync(mediaDir)) {
			// If it doesn't exist, return an error message
			return {
				status: 404,
				error: new Error('Media files directory not found')
			};
		}

		// Check if media files cached directory exists
		const cachedDir = path.resolve('./mediafiles/thumbnails');
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
				let thumbnail;

				if (['.jpeg', '.jpg', '.png', '.webp', '.tiff'].includes(fileExt)) {
					thumbnail = `/mediafiles/thumbnails/${collection || ''}/${fileName}.avif`;
				} else if (['.docx', '.xlsx', '.pptx'].includes(fileExt)) {
					thumbnail = `/path/to/your/icon/file.svg`;
				}

				// TODO: Add user permission check
				const hasPermission = true;

				return {
					image: `/mediafiles/${collection || ''}/${file}`,
					name: file,
					path: `/mediafiles/${collection || ''}`,
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
