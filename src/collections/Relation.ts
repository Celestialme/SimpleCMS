import widgets from '../components/widgets';
import Posts from './Posts2';
import type { Schema } from './types';
let schema: Schema = {
	name: 'relation',
	fields: [
		widgets.Relation({
			label: 'relation',
			relation: Posts
		})
	]
};
export default schema;
