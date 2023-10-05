import Posts3 from './Posts3';
import widgets from '../components/widgets';
import type { Schema } from './types';
let schema: Schema = {
	fields: [
		widgets.Relation({
			label: 'relation',
			relation: Posts3,
			display({ data, contentLanguage }) {
				return data.text2[contentLanguage];
			}
		}),
		widgets.Relation({
			label: 'relation2',
			relation: Posts3,
			display({ data, contentLanguage }) {
				return data?.text2[contentLanguage];
			}
		})
	]
};
export default schema;
