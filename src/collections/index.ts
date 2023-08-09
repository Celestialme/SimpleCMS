import ImageArray from './ImageArray';
import Media from './Media';
import Menu from './Menu';
import Posts1 from './Posts1';
import Posts2 from './Posts2';
import Posts3 from './Posts3';
import rel from './rel';
import Relation from './Relation';
import thumbs from './thumbs';

let allCollections = [ImageArray, Media, Menu, Posts1, Posts2, Posts3, rel, Relation, thumbs];

import { writable } from 'svelte/store';

let categories = [
	{
		name: 'Collections',
		icon: 'bi:collection',
		collections: [Posts2, Posts3, thumbs]
	},
	{
		name: 'posts',
		icon: 'bi:images',
		collections: [Posts1, ImageArray, Menu, Relation, Media]
	}
];
let collections = categories.map((x) => x.collections).reduce((x, acc) => x.concat(acc)); // returns all collections
let unAssigned = allCollections.filter((x) => !collections.includes(x));

//use this unassigned array
export { categories, unAssigned };
export default collections;
export let collection = writable(collections?.[0]); // current collection
