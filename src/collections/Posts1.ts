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
            db_fieldName: 'email',
			translated: false
		}),
		widgets.Text({ label: 'text', db_fieldName: 'text', translated: false }),
		widgets.ImageUpload({ label: 'image', db_fieldName: 'image', path: 'media/images' })
	]
};
export default schema;
