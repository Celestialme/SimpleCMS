import widgets from '../components/widgets';
import type { Schema } from './types';
let schema: Schema = {
	icon: 'iconoir:post',
	fields: [
		widgets.ImageUpload({ label: 'thumbnail', folder: 'images' }),
		widgets.RichText({ label: 'Content', translated: true, image_folder: 'images' })
	]
};
export default schema;
