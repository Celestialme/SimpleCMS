import widgets from '../components/widgets';
import type { Schema } from './types';
let schema: Schema = {
	name: 'image upload',
	fields: [
		widgets.ImageUpload({
			label: 'image',
			path: 'global'
		})
	]
};
export default schema;
