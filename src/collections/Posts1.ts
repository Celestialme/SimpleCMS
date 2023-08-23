import widgets from '../components/widgets';
import type { Schema } from './types';
let schema: Schema = {
	name: 'posts1',
	fields: [
		widgets.Email({
			display: async (data, field, entry, contentLanguage) => {
				return data[contentLanguage];
			},
			label: 'email',
			translated: false
		}),
		widgets.Text({ label: 'text', translated: false }),
		widgets.ImageUpload({ label: 'image', path: 'media/images' })
	]
};
export default schema;
