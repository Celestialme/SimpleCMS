import widgets from '../components/widgets';
import { roles } from './types';
import type { Schema } from './types';
let schema: Schema = {
	permissions: {
		[roles.user]: {
			read: false
		},
		[roles.admin]: {
			write: false
		}
	},
	fields: [
		widgets.Text({
			label: 'text',
			translated: false
		}),
		widgets.Text({
			label: 'text2',
			translated: false
		}),
		widgets.Text({
			label: 'text3',
			translated: false
		})
	]
};
export default schema;
