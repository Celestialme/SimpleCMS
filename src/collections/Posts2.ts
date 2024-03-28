import media from './media';
import widgets from '../components/widgets';
import type { Schema } from './types';
let schema: Schema = {
	icon: 'iconoir:post',

	fields: [
		widgets.Relation({ label: 'relation', relation: 'media' }),
		widgets.Text({ label: 'text', translated: true, permissions: { user: { write: false }, developer: { write: false } } }),
		widgets.Text({ label: 'text2' })
	]
};
export default schema;
