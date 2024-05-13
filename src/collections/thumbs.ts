import widgets from '../components/widgets';
import type { Schema } from './types';
let schema: Schema = {
	icon: 'material-symbols:gallery-thumbnail-outline-sharp',
	fields: [widgets.ImageUpload({ label: 'Image', folder: 'images' })]
};
export default schema;
