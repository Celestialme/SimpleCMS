import widgets from '@src/components/widgets';
import type { Schema } from '@src/collections/types';
let schema: Schema = {
	id: '6740a635a47d16674004b9d5',
	icon: 'iconoir:post',

	fields: [
		widgets.RichText({
			label: 'RichText',
			translated: true,
			image_folder: 'images',
			id: '6740a635a47d16674004b9d6'
		})
	]
};
export default schema;
