import Menu from './Menu';
import Names from './Names';
import Posts from './Posts';
import Posts2 from './Posts2';
import Relation from './Relation';
import WidgetTest from './WidgetTest';
import imageArray from './imageArray';

let allCollections = [Menu, Names, Posts, Posts2, Relation, WidgetTest, imageArray];

// Do not EDIT due to dynamic Import
// ------- END section that gets updated --------

import { writable } from 'svelte/store';

// typesafe-i18n
import { get } from 'svelte/store';
import LL from '@src/i18n/i18n-svelte';

export function updateCategories(newColumnsData) {
	categories = newColumnsData.map((column) => ({
		id: column.id,
		name: column.name,
		icon: column.icon,
		collections: column.items.map((item) => ({
			...item
		}))
	}));
}

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
	}
	// {
	// 	id: 3,
	// 	name: 'Images',
	// 	icon: 'bi:images',
	// 	collections: [{ ...imageArray, id: 3.1 }]
	// }
];

let collections = categories.map((x) => x.collections).reduce((x, acc) => x.concat(acc)); // returns all collections
let unAssigned = Object.values(allCollections).filter((x) => !collections.includes(x));
//console.log('index-unAssigned', unAssigned);

//use this unassigned array
export { categories, unAssigned, allCollections };
export default collections;
export const collection = writable(collections?.[0]); // current collection
