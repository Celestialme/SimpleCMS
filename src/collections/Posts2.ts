import widgets from '../components/widgets';
import { roles } from './types';
import type { Schema } from './types';

let schema: Schema = {
	permissions: {
		[roles.admin]: {
			read: false
		}
	},
	fields: [
		widgets.Text({
			label: 'text',
			translated: true
		}),
		widgets.Text({
			label: 'text2'
		})
	]
};
export default schema;
