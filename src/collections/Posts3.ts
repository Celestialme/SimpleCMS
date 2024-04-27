import widgets from '../components/widgets';
import type { Schema } from './types';
let schema: Schema = {
	icon: 'iconoir:post',

	fields: [
		widgets.Text({ label: 'text 1', translated: true }),
		widgets.Text({ label: 'text 2', translated: true }),
		widgets.Text({ label: 'text 3', translated: true }),
		widgets.Text({ label: 'text 4', translated: true }),
		widgets.Text({ label: 'text 5', translated: true })
	]
};
export default schema;
