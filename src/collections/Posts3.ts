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
			translated: false
		}),
		widgets.Text({
			label: 'text 2',
			translated: false
		}),
		widgets.Text({
			label: 'text 3',
			translated: false
		})
	]
};
export default schema;
