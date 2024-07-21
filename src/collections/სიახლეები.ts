import widgets from '../components/widgets';
import type { Schema } from './types';
let schema: Schema = {
	icon: 'iconoir:post',
	links: [
		'მედიცინა',
		'სტომატოლოგია',
		'ფარმაცია',
		'საზოგადოებრივი ჯანდაცვა',
		'ფიზიკური მედიცინა და რეაბილიტაცია',
		'საექთნო საქმის და სამეანო საქმის საბაკალავრო პროგრამები',
		'მედიცინისა და სტომატოლოგიის საერთაშორისო ფაკულტეტი',
		'კვლევა',
		'კლინიკური საქმიანობა',
		'დიპლომისშემდგომი',
		'კლინიკური ბაზები',
		'საერთაშორისო პროექტების მოზიდვისა და ხელშეწყობის განყოფილება'
	],
	fields: [
		widgets.Input({ label: 'text 1', translated: true, type: 'text' }),
		widgets.Input({ label: 'text 2', translated: true, type: 'text' }),
		widgets.Input({ label: 'text 3', translated: true, type: 'text' }),
		widgets.Input({ label: 'text 4', translated: true, type: 'text' }),
		widgets.Input({ label: 'text 5', translated: true, type: 'text' })
	]
};
export default schema;
