import widgets from '@src/components/widgets';
import type { Schema } from './types';
let schema: Schema = {
	icon: 'bi:images',
	fields: [
		...widgets.ImageArray({
			uploader_path: 'images',
			uploader_label: 'image 2',
			label: 'ImageArray',

			fields: [
				widgets.Text({
					label: 'title',
					db_fieldName: 'title',
					translated: false
				})
			]
		}).fields
	]
};
export default schema;
