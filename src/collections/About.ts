import widgets from '../components/widgets';
import type { Schema } from './types';
let schema: Schema = {
	icon: 'iconoir:post',
	fields: [widgets.RichText({ label: 'RichText', translated: true, image_folder: 'images' })]
};
export default schema;
