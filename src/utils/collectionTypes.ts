import fs from 'fs';
export function generateCollectionTypes(path: string) {
	console.log(path);
	if (!/src[/\\]collections/.test(path)) {
		return;
	}
	let collections =
		'export type CollectionLabels = ' +
		fs
			.readdirSync('src/collections')
			.filter((x) => {
				return !['index.ts', 'types.ts', 'config.ts'].includes(x);
			})
			.map((x) => `'${x.replace('.ts', '')}'`)
			.join('|')
			.replaceAll(/\n/g, '') +
		';';
	let types = fs.readFileSync('src/collections/types.ts', 'utf-8');
	types = types.replace(/export\s+type\s+CollectionLabels\s?=\s?.*?;/, '');

	types += collections;

	fs.writeFileSync('src/collections/types.ts', types);
}
