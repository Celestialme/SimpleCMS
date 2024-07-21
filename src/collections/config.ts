import type { CollectionNames, Schema } from './types';

export function createCategories(collections: { [key in CollectionNames]: Schema }) {
	return [
		{
			name: 'Collections',
			icon: 'bi:collection',
			collections: [collections.About, collections.News, collections.thumbs]
		},
		{
			name: 'News',
			icon: 'bi:images',
			collections: [
				collections.სიახლეები,
				collections.მედიცინა,
				collections.სტომატოლოგია,
				collections.ფარმაცია,
				collections['საზოგადოებრივი ჯანდაცვა'],
				collections['ფიზიკური მედიცინა და რეაბილიტაცია'],
				collections[
					'დიპლომისშემდგომი სამედიცინო განათლების და უწყვეტი პროფესიული განვითარების ინსტიტუტი'
				],
				collections['საექთნო საქმის და სამეანო საქმის საბაკალავრო პროგრამები'],
				collections['მედიცინისა და სტომატოლოგიის საერთაშორისო ფაკულტეტი'],
				collections.კვლევა,
				collections['კლინიკური საქმიანობა'],
				collections['დიპლომისშემდგომი'],
				collections['კლინიკური ბაზები'],
				collections['საერთაშორისო პროექტების მოზიდვისა და ხელშეწყობის განყოფილება']
			]
		},
		{
			name: 'Menus',
			icon: 'bi:images',
			collections: [collections.Menu, collections.Menu1, collections.Menu2]
		}
	];
}
