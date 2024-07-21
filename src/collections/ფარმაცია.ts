import widgets from '../components/widgets';
import type { Schema } from './types';
let schema: Schema = {
	icon: 'iconoir:post',
	hidden: true,
	fields: [
		widgets.Input({ label: 'Date', translated: true, type: 'date', width: 1 / 5 }),
		widgets.ImageUpload({ label: 'thumbnail', folder: 'images', width: 4 / 5 }),
		widgets.RichText({ label: 'Content', translated: true, image_folder: 'images' })
	]
};
export default schema;
