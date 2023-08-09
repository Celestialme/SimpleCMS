import Posts2 from './Posts2';
import widgets from '../components/widgets';
import type { Schema } from './types';
let schema: Schema = {
	name: 'relation',
	fields: [widgets.Relation({ label: 'relation', relation: Posts2 })]
};
export default schema;
