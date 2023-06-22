import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export function load({ params }) {
	// Check if mediafiles directory exists
	const mediaDir = path.resolve('./mediafiles');
	if (!fs.existsSync(mediaDir)) {
		// If it doesn't exist, return an error message
		return {
			body: { error: 'Media files not found' }
		};
	}

	// Check if mediafilescached directory exists
	const cachedDir = path.resolve('./mediafilescached');
	if (!fs.existsSync(cachedDir)) {
		// If it doesn't exist, create it
		fs.mkdirSync(cachedDir);
	}

	const collections = fs.readdirSync(mediaDir);

	const images = collections.flatMap((collection) => {
		const collectionDir = path.join(mediaDir, collection);
		const files = fs.readdirSync(collectionDir);

		// Create collection subdirectory in mediafilescached
		const cachedCollectionDir = path.join(cachedDir, collection);
		if (!fs.existsSync(cachedCollectionDir)) {
			fs.mkdirSync(cachedCollectionDir);
		}

		return files.map((file) => {
			// Generate thumbnail
			const filePath = path.join(collectionDir, file);
			const thumbnailPath = path.join(cachedCollectionDir, file + '.avif');
			sharp(filePath).resize(360).toFormat('avif').toFile(thumbnailPath);

			return {
				image: `/mediafiles/${collection}/${file}`,
				name: file,
				path: `/mediafiles/${collection}`,
				thumbnail: `/mediafilescached/${collection}/${file}.avif`
			};
		});
	});

	return {
		body: images
	};
}
