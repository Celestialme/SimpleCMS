import widgets from '@src/components/widgets';
import type { Schema } from './types';
let schema: Schema = {
	fields: [
		widgets.ImageArray({
			uploader_path: 'images',
			uploader_label: 'image',
			label: 'ImageArray',

			fields: [
				widgets.Text({
					label: 'title',
					db_fieldName: 'title',
					translated: false
				})
			]
		})
	]
};
export default schema;
