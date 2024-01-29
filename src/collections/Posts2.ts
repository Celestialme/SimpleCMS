import widgets from '../components/widgets';
import type { Schema } from './types';

let schema: Schema = {
	icon: 'iconoir:post',

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
