import widgets from '../components/widgets';
import { roles } from './Auth';
import type { Schema } from './types';

let schema: Schema = {
	name: 'posts2',
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
