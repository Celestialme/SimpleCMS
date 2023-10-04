import widgets from '@src/components/widgets';
import type { Schema } from './types';
let schema: Schema = {
	fields: [
		widgets.ImageArray({
			fields: [
				widgets.ImageUpload({
					label: 'image',
					path: 'images'
				}),

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
