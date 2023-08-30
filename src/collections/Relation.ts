import thumbs from './thumbs';
import widgets from '../components/widgets';
import type { Schema } from './types';
let schema: Schema = {
	fields: [widgets.Relation({ label: 'relation', relation: thumbs })]
};
export default schema;
