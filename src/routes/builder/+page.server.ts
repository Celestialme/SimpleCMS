import { type Actions, error } from '@sveltejs/kit';
import type { WidgetType } from '@src/components/widgets';
import fs from 'fs';
import prettier from 'prettier';
import prettierConfig from '@root/.prettierrc.json';

import { sanitizePermissions } from '@src/collections/types';
import { writeCollection } from '@src/utils/collections.js';
import mongoose from 'mongoose';

type fields = ReturnType<WidgetType[keyof WidgetType]>;
export async function load(event) {
	let user = event.locals.user;
	if (user.role != 'admin') {
		throw error(404, {
			message: 'you dont have an access to this page'
		});
	}
	return {
		user
	};
}

export const actions: Actions = {
	saveCollection: async ({ request }) => {
		let formData = await request.formData();
		let fieldsData = formData.get('fields') as string;

		let originalName = JSON.parse(formData.get('originalName') as string).replaceAll('::', '/');
		let collectionName = JSON.parse(formData.get('collectionName') as string).replaceAll('::', '/');
		let permissions = sanitizePermissions(JSON.parse(formData.get('permissions') as string));
		let id = JSON.parse(formData.get('id') as string) || new mongoose.Types.ObjectId();
		let icon = JSON.parse((formData.get('icon') as string) || '""');
		let fields = JSON.parse(fieldsData) as Array<fields>;

		await writeCollection({
			id,
			icon,
			fields,
			originalName,
			collectionName,
			permissions
		});
		return null;
	}
};
