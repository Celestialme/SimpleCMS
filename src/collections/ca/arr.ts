import widgets from '@src/components/widgets';
import type { Schema } from '@src/collections/types';
let schema: Schema = {
	id: 'ARR40aa1640bb71f1b9127851',
	icon: 'iconoir:post',

	fields: [
		widgets.ImageArray({
			id: '2740a9df834dc88c5e1603a9',
			uploader_label: 'image',
			label: 'image',
			uploader_path: 'images2',
			extractFields: true,
			fields: [
				widgets.Input({
					translated: true,
					label: 'Text',
					type: 'text',
					id: '2740a9df834dc88c5e1603a9'
				})
			]
		})
	]
};
export default schema;
