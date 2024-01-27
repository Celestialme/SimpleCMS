import widgets from '../components/widgets';
import type { Schema } from './types';
let schema: Schema = {
	icon: 'lets-icons:menu',
	fields: [
		widgets.Relation({
			label: 'relation',
			relation: 'Posts3',
			display({ data, contentLanguage }) {
				return data?.['text 2']?.[contentLanguage];
			}
		})
	]
};
export default schema;
