import widgets from '../components/widgets';
import type { Schema } from './types';
let schema: Schema = {
	name: 'thumbs',
	fields: [widgets.ImageUpload({ label: 'Image', path: 'images' })]
};
export default schema;
