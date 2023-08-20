import widgets from '@src/components/widgets';
import { roles } from './Auth';
import type { Schema } from './types';

const schema: Schema = {
	// Collection Name required
	name: 'imagearray',

	// Optional & Icon , status, slug
	// See for possible Icons https://icon-sets.iconify.design/
	icon: 'bi:images',

	// Defined Fields that are used in Collection
	// Inspect Widget fields for possible options
	fields: [
		widgets.ImageArray({
			label: 'Images Array',
			imageUploadTitle: 'image',
			fields: [
				widgets.ImageUpload({
					label: 'image',
					path: 'global'
				}),
				widgets.Text({
					label: 'Image Title',
					db_fieldName: 'title',
					placeholder: 'Enter Title'
				}),
				widgets.Text({
					label: 'Alt Text',
					db_fieldName: 'alt',
					placeholder: 'Enter Alt Text',
					required: true
				})
			]
		})
	]
};

export default schema;
