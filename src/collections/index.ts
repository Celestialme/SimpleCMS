import { writable } from 'svelte/store';

// typesafe-i18n
import { get } from 'svelte/store';
import LL from '@src/i18n/i18n-svelte.js';

// List of Collections
import ImageArray from './imageArray';
import Menu from './Menu';
import Posts from './Posts';
import Names from './Names';
import Posts2 from './Posts2';
import Relation from './Relation';
import WidgetTest from './WidgetTest';

// Display how Collections are sorted and displayed in Categories section
// TODO Add translations
let categories = [
	{
		id: 1,
		name: get(LL).CollectionCategory_Collection(),
		icon: 'bi:collection',
		collections: [
			{ ...Posts, id: 1.1 },
			{ ...Names, id: 1.2 },
			{ ...Posts2, id: 1.3 },
			{ ...Relation, id: 1.4 },
			{ ...WidgetTest, id: 1.5 }
		]
	},
	{
		id: 2,
		name: get(LL).CollectionCategory_Menu(),
		icon: 'bi:menu-button-wide',
		collections: [{ ...Menu, id: 2.1 }]
	},
	{
		id: 3,
		name: 'Images',
		icon: 'bi:images',
		collections: [{ ...ImageArray, id: 3.1 }]
	}
];

export { categories };
let collections = categories.map((x) => x.collections).reduce((x, acc) => x.concat(acc)); // returns all collections
export default collections;
export let collection = writable(collections?.[0]); // current collection
