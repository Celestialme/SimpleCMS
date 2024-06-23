import widgets from '@src/components/widgets';
import type { Schema } from './types';
let schema: Schema = {
	icon: 'bi:images',
	fields: [
		widgets.ImageArray({
			uploader_path: 'images',
			uploader_label: 'image2',
			label: 'ImageArray',

			fields: [
				widgets.Input({
					label: 'title',
					db_fieldName: 'title',
					translated: false,
					type: 'text'
				})
			]
		})
	]
};
export default schema;
