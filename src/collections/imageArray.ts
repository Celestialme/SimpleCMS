import widgets from '@src/components/widgets';
import { roles } from './Auth';
import type { Schema } from './types';

let schema: Schema = {
	// Collection Name required
	name: 'imagearray',

	// Optional & Icon , status, slug
	// See for possible Icons https://icon-sets.iconify.design/
	icon: 'bi:images',

	// Defined Fields that are used in Collection
	// Inspect Widget fields for possible options
	fields: [
		widgets.ImageArray({
			label: 'images',
			imageUploadTitle: 'image',
			fields: [
				widgets.ImageUpload({
					label: 'image',
					path: 'mediafiles/images'
				}),
				widgets.Text({
					label: 'title',
					db_fieldName: 'title'
				})
			]
		})
	]
};

export default schema;
