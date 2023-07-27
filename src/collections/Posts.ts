import widgets from '../components/widgets';
import type { Schema } from './types';
let schema: Schema = {
	name: 'posts1',
	fields: [
		widgets.Email({
			label: 'email',
			translated: false,
			display: async (data, field, entry, contentLanguage) => {
				return data;
			}
		}),
		widgets.Text({
			label: 'text',
			translated: false
		}),
		widgets.ImageUpload({
			label: 'image',
			path: 'media/images'
		})
	]
};
export default schema;
