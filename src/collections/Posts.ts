import widgets from '@src/components/widgets';
import { roles } from './Auth';
import type { Schema } from './types';

const schema: Schema = {
	// Collection Name required
	name: 'posts',

	// Optional & Icon , status, slug
	// See for possible Icons https://icon-sets.iconify.design/
	icon: 'bi:card-text',
	status: 'published',
	slug: 'posts',

	// Defined Fields that are used in Collection
	// Inspect Widget fields for possible options
	fields: [
		widgets.Email({
			label: 'email',
			translated: false,
			display: async (data, field, entry, contentLanguage) => {
				return data;
			}
		}),

		widgets.Text({
			label: 'test',
			db_fieldName: 'dbtest',
			translated: true,
			required: true,
			icon: 'ri:t-box-line',
			placeholder: 'Enter Test Placeholder'
		}),

		widgets.ImageUpload({
			label: 'image',
			path: 'mediafiles/posts'
		})
	]
};
export default schema;
