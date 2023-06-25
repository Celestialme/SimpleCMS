import { writable } from 'svelte/store';

// List of Collections
import ImageArray from './imageArray';
import Menu from './Menu';
import Posts from './Posts';
import Names from './Names';
import Posts3 from './Posts3';
import Relation from './Relation';
import WidgetTest from './WidgetTest';

// Display how Collections are sorted and displayed in Categories section
let categories = [
	{
		name: 'Collections',
		icon: 'bi:collection',
		collections: [Posts, Names, Posts3, Relation, WidgetTest]
	},
	{
		name: 'Menus',
		icon: 'bi:menu-button-wide',
		collections: [Menu]
	},
	{
		name: 'Images',
		icon: 'bi:images',
		collections: [ImageArray]
	}
];
export { categories };
let collections = categories.map((x) => x.collections).reduce((x, acc) => [].concat(x, acc)); // returns all collections
export default collections;
export let collection = writable(collections?.[0]); // current collection
