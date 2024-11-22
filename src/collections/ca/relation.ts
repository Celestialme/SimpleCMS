import widgets from '@src/components/widgets';
import type { Schema } from '@src/collections/types';
let schema: Schema = {
	id: '6740a635a47d16674004b9d9',
	icon: 'iconoir:post',

	fields: [
		widgets.Relation({
			label: 'Relation',
			relation: 'ca::About',
			displayPath: 'RichText',
			id: '6740a635a47d16674004b9da'
		})
	]
};
export default schema;
