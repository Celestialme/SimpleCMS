import widgets from '@src/components/widgets';
import type { Schema } from '@src/collections/types';
let schema: Schema = {
	id: 'asda1',
	icon: 'iconoir:post',

	fields: [
		widgets.RichText({ label: 'RichText', translated: true, image_folder: 'images' }),
		widgets.Relation({ label: 'Relation', relation: 'ca::About', displayPath: 'RichText' })
	]
};
export default schema;
