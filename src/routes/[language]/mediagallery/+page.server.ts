import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export function load({ params }) {
	// Check if media files directory exists
	const mediaDir = path.resolve('./mediafiles');
	if (!fs.existsSync(mediaDir)) {
		// If it doesn't exist, return an error message
		return {
			body: { error: 'Media files not found' }
		};
	}

	// Check if media files cached directory exists
	const cachedDir = path.resolve('./mediafilescached');
	if (!fs.existsSync(cachedDir)) {
		// If it doesn't exist, create it
		fs.mkdirSync(cachedDir);
	}

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
				const cachedCollectionDir = path.join(cachedDir, collection || '');
				if (!fs.existsSync(cachedCollectionDir)) {
					fs.mkdirSync(cachedCollectionDir);
				}
				const thumbnailPath = path.join(cachedCollectionDir, fileName + '.avif');
				sharp(filePath).resize(360).toFormat('avif').toFile(thumbnailPath);
				thumbnail = `/mediafilescached/${collection || ''}/${fileName}.avif`;
			} else if (['.docx', '.xlsx', '.pptx'].includes(fileExt)) {
				thumbnail = `/path/to/your/icon/file.svg`;
			}

			return {
				image: `/mediafiles/${collection || ''}/${file}`,
				name: file,
				path: `/mediafiles/${collection || ''}`,
				thumbnail
			};
		});
	});

	return {
		body: images
	};
}
