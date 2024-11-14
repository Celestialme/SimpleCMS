import widgets from '@src/components/widgets';
import type { Schema } from '@src/collections/types';
let schema: Schema = {
	id: 'sm2',
	icon: 'iconoir:post',

	fields: [
		widgets.ImageArray({
			fields: [widgets.Input({ label: 'Text', type: 'text' })],
			label: 'ImageArray',
			uploader_label: 'Image',
			uploader_path: 'images',
			extract: true
		})
	]
};
export default schema;
