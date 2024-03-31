import widgets from '@src/components/widgets';

import type { Schema } from './types';
let schema: Schema = {
	icon: 'pepicons-pop:menu',

	fields: [
		widgets.MegaMenu({
			fields: [[widgets.Text({ label: 'link 1', translated: true }), widgets.ImageUpload({ label: 'image', path: 'images' })]],
			label: 'Menu'
		})
	]
};
export default schema;
