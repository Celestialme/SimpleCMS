import widgets from '@src/components/widgets';

import type { Schema } from './types';
let schema: Schema = {
	icon: 'pepicons-pop:menu',
	fields: [
		widgets.MegaMenu({
			menu: [
				[
					widgets.Text({ label: 'link 1', translated: true }),
					widgets.Text({ label: 'info', translated: true }),
					widgets.Text({ label: 'info3', translated: true })
				],
				[
					widgets.Text({ label: 'link 2', translated: true }),
					widgets.Text({ label: 'info', translated: true }),
					widgets.Text({ label: 'info3', translated: true })
				]
			],
			label: 'Menu'
		})
	]
};
export default schema;
