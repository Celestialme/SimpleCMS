import ImageArray from './ImageArray';
import Media from './Media';
import Menu from './Menu';
import Posts from './Posts';
import Posts2 from './Posts2';
import Names from './Names';
import Relation from './Relation';
import WidgetTest from './WidgetTest';

const allCollections = { ImageArray, Media, Menu, Posts, Posts2, Names, Relation, WidgetTest };

import { writable } from 'svelte/store';

const categories = [
	{
		name: 'Collections',
		icon: 'bi:collection',
		collections: [Posts, Names, WidgetTest]
	},
	{
		name: 'Posts',
		icon: 'bi:images',
		collections: [Posts2, ImageArray, Relation, Media]
	},
	{
		name: 'Menu',
		icon: 'bi:menu-button-wide',
		collections: [Menu]
	}
];
const collections = categories.map((x) => x.collections).reduce((x, acc) => x.concat(acc)); // returns all collections
const unAssigned = Object.values(allCollections).filter((x) => !collections.includes(x));

//use this unassigned array
export { categories, unAssigned, allCollections };
export default collections;
export const collection = writable(collections?.[0]); // current collection
