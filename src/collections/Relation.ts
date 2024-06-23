import widgets from '../components/widgets';
import type { Schema } from './types';
let schema: Schema = {
	icon: 'lets-icons:menu',
	fields: [
		widgets.Input({
			label: 'info',
			translated: true,
			type: 'text'
		}),
		widgets.Relation({
			label: 'relation2',
			relation: 'News',
			displayPath: 'thumbnail'
		})
	]
};
export default schema;
