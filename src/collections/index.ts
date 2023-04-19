import { writable } from 'svelte/store';
import ImageArray from './imageArray';
import Posts from './Posts';
import Posts2 from './Posts2';
import Posts3 from './Posts3';

let categories = [
	{
		name: 'Collections',
		icon: 'bi:collection',
		collections: [Posts2, Posts3]
	},
	{
		name: 'posts',
		icon: 'bi:images',
		collections: [Posts, ImageArray]
	}
];
export { categories };
let collections = categories.map((x) => x.collections).reduce((x, acc) => x.concat(acc)); // returns all collections
export default collections;
export let collection = writable(collections?.[0]); // current collection
