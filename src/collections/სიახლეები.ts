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
		widgets.Input({ label: 'Date', translated: true, type: 'date', width: 1 / 5 }),
		widgets.ImageUpload({ label: 'thumbnail', folder: 'images', width: 4 / 5 }),
		widgets.RichText({ label: 'Content', translated: true, image_folder: 'images' })
	]
};
export default schema;
