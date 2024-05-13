import widgets from '../components/widgets';
import type { Schema } from './types';
let schema: Schema = {
	icon: 'material-symbols:gallery-thumbnail-outline-sharp',
	fields: [
		widgets.ImageUpload({ label: 'Image', folder: 'images' }),
		widgets.ImageUpload({ label: 'Image2', folder: 'images2' })
	]
};
export default schema;
