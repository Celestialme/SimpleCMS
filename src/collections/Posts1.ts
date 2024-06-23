import widgets from '../components/widgets';
import type { Schema } from './types';
let schema: Schema = {
	icon: 'iconoir:post',
	fields: [
		widgets.Input({
			type: 'email',
			display: async ({ data, field, entry, contentLanguage }) => {
				return data[contentLanguage];
			},
			label: 'email'
		}),
		widgets.Input({ label: 'text', translated: false, type: 'text' }),
		widgets.ImageUpload({ label: 'image', folder: 'images' })
	]
};
export default schema;
