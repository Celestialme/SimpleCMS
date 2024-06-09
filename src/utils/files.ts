import fs from 'fs';
import Path from 'path';
import type sharp from 'sharp';
import type { ImageFiles } from './types';
import publicConfig from '@root/config/public';
import mongoose from 'mongoose';
import _crypto from 'crypto';
import { browser } from '$app/environment';
function removeExtension(fileName) {
	const lastDotIndex = fileName.lastIndexOf('.');
	if (lastDotIndex === -1) {
		// If the file has no extension, return the original fileName
		return { name: fileName, ext: '' };
	}
	return { name: fileName.slice(0, lastDotIndex), ext: fileName.slice(lastDotIndex + 1) };
}
let env_sizes = publicConfig.IMAGE_SIZES;
export const SIZES = { ...env_sizes, original: 0, thumbnail: 320 } as const;
export async function saveImage(
	file: File,
	folder: string
): Promise<{ id: mongoose.Types.ObjectId; fileInfo: ImageFiles }> {
	if (browser) return {} as any;
	let sharp = (await import('sharp')).default;

	let fileInfo: { [key: string]: any } = {};

	let arrayBuffer = await file.arrayBuffer();
	let buffer = Buffer.from(arrayBuffer);
	let hash = _crypto.createHash('sha256').update(buffer).digest('hex').slice(0, 20);
	let existing_file = await mongoose.models['_storage_images'].findOne({ hash: hash });
	if (existing_file) {
		return { id: new mongoose.Types.ObjectId(existing_file._id), fileInfo: existing_file };
	}
	let { name, ext } = removeExtension(file.name);

	fileInfo = {
		hash,
		used_by: [],
		folder: folder
	};
	let keys = Object.keys(SIZES).filter((key) => key != 'original');
	keys.unshift('original');
	for (let size of keys) {
		if (fileInfo.original && SIZES[size] > fileInfo.original.width) {
			// if size is larger than original use original
			fileInfo[size] = fileInfo.original;
			continue;
		}
		let resizedImage: {
			info: sharp.OutputInfo;
			data: Buffer;
		};
		let url: string;
		if (ext == 'svg') {
			if (fileInfo.original) {
				fileInfo[size] = fileInfo.original; // use original
				continue; // dont write on disk if not original
			}
			resizedImage = {
				info: (await sharp(buffer).metadata()) as any,
				data: buffer
			};

			url = `images/${size}/${hash}.svg`;
		} else if (ext == 'gif') {
			resizedImage = await sharp(buffer, { animated: true })
				.resize({ width: SIZES[size] || undefined })
				.toFormat('webp', { quality: 80 })
				.toBuffer({ resolveWithObject: true });
			url = `images/${size}/${hash}.webp`;
		} else {
			resizedImage = await sharp(buffer)
				.resize({ width: SIZES[size] || undefined })
				.toFormat('avif', { quality: 80 })
				.toBuffer({ resolveWithObject: true });
			url = `images/${size}/${hash}.avif`;
		}

		if (!fs.existsSync(Path.dirname(`${publicConfig.STORAGE_FOLDER}/${url}`))) {
			fs.mkdirSync(Path.dirname(`${publicConfig.STORAGE_FOLDER}/${url}`), { recursive: true });
		}
		//sized images
		fs.writeFileSync(`${publicConfig.STORAGE_FOLDER}/${url}`, resizedImage.data);
		fileInfo[size] = {
			name: `${name}.${removeExtension(url).ext}`,
			url: '/storage/' + url,
			size: resizedImage.info.size,
			type: 'image/avif',
			lastModified: file.lastModified,
			width: resizedImage.info.width,
			height: resizedImage.info.height
		};
	}

	let res = await mongoose.models['_storage_images'].insertMany(fileInfo);

	return { id: new mongoose.Types.ObjectId(res[0]._id), fileInfo: fileInfo as ImageFiles };
}
