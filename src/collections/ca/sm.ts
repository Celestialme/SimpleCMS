import widgets from '@src/components/widgets';
import type { Schema } from '@src/collections/types';
let schema: Schema = {
	id: '1740aa1640bb71f1b9127851',
	icon: 'iconoir:post',

	fields: [
		widgets.Relation({
			relation: 'ca::sm2',
			label: 'relation',
			displayPath: 'Text',
			id: '6748959e0840aa58c660df97'
		})
	]
};
export default schema;
