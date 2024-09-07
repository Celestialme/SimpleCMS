import widgets from '@src/components/widgets';
import type { Schema } from '@src/collections/types';
let schema: Schema = {
	id: 'sm',
	icon: 'iconoir:post',
	fields: [
		widgets.Input({ label: 'Name', translated: true, type: 'text' }),
		widgets.Input({ label: 'Name2', translated: true, type: 'text' })
	]
};
export default schema;
