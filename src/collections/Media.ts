import widgets from '../components/widgets';
import { roles } from './Auth';
import type { Schema } from './types';

const schema: Schema = {
	// Collection Name required
	name: 'image upload',

	fields: [
		widgets.ImageUpload({
			label: 'image',
			path: 'global'
		})
	]
};

export default schema;
