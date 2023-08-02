import widgets from '../components/widgets';
import type { Schema } from './types';
let schema: Schema = {
	name: 'Menu',
	fields: [
		widgets.MegaMenu({
			menu: [
				{ fields: [widgets.Text({ label: 'Header', translated: true })] },
				{
					fields: [
						widgets.Text({ label: 'Header', translated: true }),
						widgets.Text({ label: 'link', translated: true }),
						widgets.Text({ label: 'info', translated: true }),
						widgets.Text({ label: 'info3', translated: true })
					]
				}
			],
			label: 'Menu'
		})
	]
};
export default schema;
