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
		collections: [Posts]
	}
];
export { categories };

export default categories.map((x) => x.collections).reduce((x, acc) => x.concat(acc)); // returns all collections
