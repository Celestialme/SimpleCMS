import widgets from '../components/widgets';
import type { Schema } from './types';

let schema: Schema = {
	icon: 'iconoir:post',

	fields: [
		widgets.Relation({
			label: 'relation',
			relation: 'media',
			displayPath: 'image'
		}),
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
