import widgets from '@src/components/widgets';
import type { Schema } from '@src/collections/types';
let schema: Schema = {
	id: 'sm2',
	icon: 'iconoir:post',

	fields: [
		widgets.Input({
			label: 'Text',
			type: 'text',
			translated: true
		}),
		widgets.Input({
			label: 'Text2',
			type: 'text',
			translated: true
		})
	]
};
export default schema;
