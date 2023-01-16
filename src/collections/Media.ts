import widgets from '../components/widgets';

import type { Schema } from './types';

let schema: Schema = {
	// Collection Name & Icon (optional) shown on Sidebar
	// See for possible Icons https://icon-sets.iconify.design/
	name: 'Media',
	icon: 'bi:menu-button-wide',
	status:"published",
	// Defined Fields that are used in Collection
	// Inspect Widget fields for possible options
	fields: [widgets.ImageUpload({ db_fieldName: 'Upload Image', path: 'media/images' })]
};

export default schema;
