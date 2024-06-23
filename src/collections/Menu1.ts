import widgets from '@src/components/widgets';

import type { Schema } from './types';
let schema: Schema = {
	icon: 'pepicons-pop:menu',

	fields: [
		widgets.MegaMenu({
			fields: [
				[
					widgets.Input({ label: 'link 1', translated: true, type: 'text' }),
					widgets.ImageUpload({ label: 'image', folder: 'images' })
				]
			],
			label: 'Menu'
		})
	]
};
export default schema;
