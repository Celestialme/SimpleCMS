import widgets from '@src/components/widgets';
import type { Schema } from '@src/collections/types';
let schema: Schema = {
	id: 'relation',
	icon: 'iconoir:post',
	fields: [widgets.Relation({ label: 'Relation', relation: 'ca::About', displayPath: 'RichText' })]
};
export default schema;
