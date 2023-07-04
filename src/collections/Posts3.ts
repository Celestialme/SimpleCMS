import widgets from '../components/widgets';
import { roles } from './Auth';
import type { Schema } from './types';
let schema: Schema = {
	name: 'posts3',
	permissions: {
		[roles.user]: {
			read: false
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
