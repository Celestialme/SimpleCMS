import widgets from '../components/widgets';
import type { Schema } from './types';
let schema: Schema = {
	icon: 'lets-icons:menu',
	fields: [
		widgets.Relation({
			label: 'relation',
			relation: 'Posts3',
			displayPath: 'text 1'
		})
	]
};
export default schema;
