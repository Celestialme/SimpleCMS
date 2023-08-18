import { PUBLIC_MEDIA_FOLDER } from '$env/static/public';
import type { RequestHandler } from '@sveltejs/kit';
import fs from 'fs';
import Path from 'path';
import { auth } from '@src/routes/api/db';
export const POST: RequestHandler = async ({ params, request }) => {
	const data = await request.formData();
	let avatar = data.get('avatar') as Blob;
	let userID = data.get('userID') as string;
	let url = `/media/images/avatars/${avatar.name}`;
	if (avatar) {
		if (!fs.existsSync(Path.dirname(`${PUBLIC_MEDIA_FOLDER}/images/avatars/${avatar.name}`))) {
			fs.mkdirSync(Path.dirname(`${PUBLIC_MEDIA_FOLDER}/images/avatars/${avatar.name}`), {
				recursive: true
			});
		}
		fs.writeFileSync(
			`${PUBLIC_MEDIA_FOLDER}/images/avatars/${avatar.name}`,
			Buffer.from(await avatar.arrayBuffer())
		);
	}
	auth.updateUserAttributes(userID, {
		avatar: url
	});
	return new Response(JSON.stringify({ url }), { status: 200 });
};
