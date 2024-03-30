import widgets from '@src/components/widgets';

import type { Schema } from './types';
let schema: Schema = {
	icon: 'pepicons-pop:menu',

	fields: [
		widgets.MegaMenu({
			fields: [[widgets.Text({ label: 'link 1', translated: true }), widgets.Relation({ label: 'Image', relation: 'thumbs', displayPath: 'Image' })]],
			label: 'Menu'
		})
	]
};
export default schema;
