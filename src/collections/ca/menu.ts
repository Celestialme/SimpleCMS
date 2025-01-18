import widgets from '@src/components/widgets';
import type { Schema } from '@src/collections/types';
let schema: Schema = {
	id: 'm740aa1640bb71f1b9127851',
	icon: 'iconoir:post',
	fields: [
		widgets.MegaMenu({
			label: 'Menu',
			id: '678b6aab95a33f458843c57a',
			fields: [
				[
					widgets.Input({
						label: 'Header',
						translated: true,
						type: 'text',
						id: '678b6b2c53219b205e3c9a59'
					})
				],
				[
					widgets.Input({
						label: 'Header',
						translated: true,
						type: 'text',
						id: '678b6b2c53219b205e3c9a5a'
					}),
					widgets.Input({
						label: 'Text',
						translated: true,
						type: 'text',
						id: '678b6aaa95a33f458843c573'
					})
				]
			]
		})
	]
};
export default schema;
