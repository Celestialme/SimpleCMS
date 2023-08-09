import widgets from '../components/widgets';
import type { Schema } from './types';
let schema: Schema = {
	name: 'rel',
	fields: [widgets.Relation({ relation: 'Posts', label: 'ewl' })]
};
export default schema;
