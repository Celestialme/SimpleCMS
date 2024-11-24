import widgets from '@src/components/widgets';
import type { Schema } from '@src/collections/types';
let schema: Schema = {
	id: '6740a635a47d16674004b9e9',
	icon: 'iconoir:post',

	fields: [
		widgets.RichText({
			label: 'RichText',
			translated: true,
			image_folder: 'images',
			id: '6740a635a47d16674004b9ea'
		}),
		widgets.Relation({
			label: 'Relation',
			relation: 'ca::About',
			displayPath: 'RichText',
			id: '6740a635a47d16674004b9eb'
		}),
		widgets.Relation({
			label: 'Relation2',
			relation: 'ca::About',
			displayPath: 'RichText',
			id: '6740a635a47d16674004b9ec'
		})
	]
};
export default schema;
