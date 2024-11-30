import widgets from '@src/components/widgets';
import type { Schema } from '@src/collections/types';
let schema: Schema = {
	id: '6740aa1640bb71f1b9127851',
	icon: 'iconoir:post',

	fields: [
		widgets.Input({
			translated: true,
			label: 'Text',
			type: 'text',
			id: '2740a9df834dc88c5e1603a9'
		}),
		widgets.ImageUpload({
			id: '2740a9df834dc88c5e1603a9',
			label: 'image',
			folder: 'images'
		})
	]
};
export default schema;
