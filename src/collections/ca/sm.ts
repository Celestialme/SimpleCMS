import widgets from '@src/components/widgets';
import type { Schema } from '@src/collections/types';
let schema: Schema = {
	id: 'sm',
	icon: 'iconoir:post',
	fields: [
		widgets.MegaMenu({
			label: 'MegaMenu',

			fields: [
				[
					widgets.Input({
						label: 'Text',
						type: 'text'
					}),
					widgets.Input({
						label: 'Text2',
						type: 'text'
					})
				],
				[
					widgets.Input({
						label: 'Text2-1',
						type: 'text'
					}),
					widgets.Input({
						label: 'Text2-2',
						type: 'text'
					})
				],
				[
					widgets.Input({
						label: 'Text3-1',
						type: 'text'
					}),
					widgets.Input({
						label: 'Text3-2',
						type: 'text'
					})
				]
			]
		})
	]
};
export default schema;
