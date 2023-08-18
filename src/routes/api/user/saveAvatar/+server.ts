import { PUBLIC_MEDIA_FOLDER, PUBLIC_MEDIA_OUTPUT_FORMAT } from '$env/static/public';
import type { RequestHandler } from '@sveltejs/kit';
import fs from 'fs';
import Path from 'path';
import { auth } from '@src/routes/api/db';
import { sanitize } from '@src/utils/utils';
import sharp from 'sharp';
import crypto from 'crypto';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.formData();
	const avatar = data.get('avatar') as Blob;
	const userID = data.get('userID') as string;
	const url = `/media/images/avatars/${avatar.name}`;

	if (avatar) {
		// Read the uploaded file as a buffer
		const buffer = Buffer.from(await avatar.arrayBuffer());

		const outputFormat = PUBLIC_MEDIA_OUTPUT_FORMAT || 'original';

		// Optimize the image using sharp
		const optimizedBuffer = await sharp(buffer)
			.rotate() // Automatically rotate
			.resize(400) // Resize to 400px
			.toFormat(outputFormat === 'webp' ? 'webp' : 'avif', {
				quality: outputFormat === 'webp' ? 80 : 50,
				progressive: true
			})
			.withMetadata() // Preserve original metadata
			.toBuffer(); // Get the optimized buffer

		// Hash the file name using crypto
		const hash = crypto.createHash('sha256').update(buffer).digest('hex').slice(0, 20); // Get first 20 characters of hash

		// Sanitize the file name using your function
		const sanitized = sanitize(avatar.name);

		// Append the hash and sanitized name
		const fileName = `${hash}-${sanitized}`;

		if (!fs.existsSync(Path.dirname(`${PUBLIC_MEDIA_FOLDER}/images/avatars/${fileName}`))) {
			fs.mkdirSync(Path.dirname(`${PUBLIC_MEDIA_FOLDER}/images/avatars/${fileName}`), {
				recursive: true
			});
		}

		// Write the optimized buffer to a file
		fs.writeFileSync(`${PUBLIC_MEDIA_FOLDER}/images/avatars/${avatar.name}`, optimizedBuffer);
	}

	auth.updateUserAttributes(userID, {
		avatar: url
	});

	return new Response(JSON.stringify({ url }), { status: 200 });
};
