import widgets from '../components/widgets';
import type { Schema } from './types';
let schema: Schema = {
	icon: 'iconoir:post',
	label: 'დიპლომისშემდგომი სამედიცინო განათლების და უწყვეტი პროფესიული განვითარების ინსტიტუტი',
	hidden: true,
	fields: [
		widgets.Input({ label: 'text 1', translated: true, type: 'text' }),
		widgets.Input({ label: 'text 2', translated: true, type: 'text' }),
		widgets.Input({ label: 'text 3', translated: true, type: 'text' }),
		widgets.Input({ label: 'text 4', translated: true, type: 'text' }),
		widgets.Input({ label: 'text 5', translated: true, type: 'text' })
	]
};
export default schema;
