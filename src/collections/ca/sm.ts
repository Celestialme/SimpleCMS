import widgets from '@src/components/widgets';
import type { Schema } from '@src/collections/types';
let schema: Schema = {
	id: '6740a635a47d16674004b9db',
	icon: 'iconoir:post',

	fields: [
		widgets.MegaMenu({
			label: 'MegaMenu',
			fields: [
				[
					widgets.Input({
						label: 'Header',
						translated: true,
						type: 'text',
						id: '6740a635a47d16674004b9dc'
					})
				],
				[
					widgets.Input({
						label: 'Header',
						translated: true,
						type: 'text',
						id: '6740a635a47d16674004b9dd'
					}),
					widgets.Input({ label: 'Text', type: 'text', id: '6740a635a47d16674004b9de' }),
					widgets.Input({ label: 'Text2', type: 'text', id: '6740a635a47d16674004b9df' })
				],
				[
					widgets.Input({
						label: 'Header',
						translated: true,
						type: 'text',
						id: '6740a635a47d16674004b9e0'
					}),
					widgets.Input({ label: 'Text2-1', type: 'text', id: '6740a635a47d16674004b9e1' }),
					widgets.Input({ label: 'Text2-2', type: 'text', id: '6740a635a47d16674004b9e2' })
				],
				[
					widgets.Input({
						label: 'Header',
						translated: true,
						type: 'text',
						id: '6740a635a47d16674004b9e3'
					}),
					widgets.Input({ label: 'Text3-1', type: 'text', id: '6740a635a47d16674004b9e4' }),
					widgets.Input({ label: 'Text3-2', type: 'text', id: '6740a635a47d16674004b9e5' })
				]
			],
			id: '6740a635a47d16674004b9e6'
		})
	]
};
export default schema;
