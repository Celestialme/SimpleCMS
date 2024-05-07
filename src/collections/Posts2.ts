import widgets from '../components/widgets';
import type { Schema } from './types';
let schema: Schema = {
	icon: 'iconoir:post',

	fields: [
		widgets.RichText({ label: 'RichText', translated: true }),
		widgets.ImageUpload({ label: 'image', path: 'media/images' })
	]
};
export default schema;
