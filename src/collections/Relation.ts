import widgets from '../components/widgets';
import type { Schema } from './types';
let schema: Schema = {
	icon: 'lets-icons:menu',
	fields: [
		widgets.Text({
			label: 'info',
			translated: true
		}),
		widgets.Relation({
			label: 'relation2',
			relation: 'Posts2',
			displayPath: 'RichText'
		})
	]
};
export default schema;
