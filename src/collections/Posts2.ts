import widgets from '../components/widgets';
import type { Schema } from './types';
let schema: Schema = {
	icon: 'iconoir:post',

	fields: [widgets.RichText({ label: 'RichText', translated: true })]
};
export default schema;
