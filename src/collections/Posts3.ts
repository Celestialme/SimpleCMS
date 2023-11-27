import widgets from '../components/widgets';
import { roles } from './types';
import type { Schema } from './types';
let schema: Schema = {
	permissions: {
		[roles.user]: {
			read: true
		},
		[roles.admin]: {
			write: true
		}
	},
	fields: [
		widgets.Text({
			label: 'text 1',
			translated: false,
			width: 2
		}),
		widgets.Text({
			label: 'text 2',
			translated: false,
			width: 2
		}),
		widgets.Text({
			label: 'text 3',
			translated: false,
			width: 2
		}),
		widgets.Text({
			label: 'text 4',
			translated: false,
			width: 2
		}),
		widgets.Text({
			label: 'text 5',
			translated: false,
			width: 1
		})
	]
};
export default schema;
