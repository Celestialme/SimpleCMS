import widgets from '@src/components/widgets';
import type { Schema } from '@src/collections/types';
let schema: Schema = {
	links: ['ca::ca12::About'],

	label: 'About',
	id: 'asda2',
	icon: 'iconoir:post',
	fields: [widgets.RichText({ label: 'RichText', translated: true, image_folder: 'images' })]
};
export default schema;
