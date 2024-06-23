import widgets from '@src/components/widgets';

import type { Schema } from './types';
let schema: Schema = {
	icon: 'pepicons-pop:menu',

	fields: [
		widgets.MegaMenu({
			fields: [
				[
					widgets.Input({
						label: 'link 1',
						translated: true,
						type: 'text'
					}),
					widgets.Input({ label: 'info', translated: true, type: 'text' }),
					widgets.Input({ label: 'info3', translated: true, type: 'text' })
				],
				[
					widgets.Input({
						label: 'link 2',
						translated: true,
						type: 'text'
					}),
					widgets.Input({ label: 'info', translated: true, type: 'text' }),
					widgets.Input({ label: 'info3', translated: true, type: 'text' })
				],
				[
					widgets.Input({ label: 'link 3', translated: true, type: 'text' }),
					widgets.Input({ label: 'info', translated: true, type: 'text' }),
					widgets.Input({ label: 'info3', translated: true, type: 'text' })
				]
			],
			label: 'Menu'
		})
	]
};
export default schema;
