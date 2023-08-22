import { building, dev } from '$app/environment';
import fs from 'fs';
export function getCollections() {
	if (building) return;
	let files;

	let imports = {} as any;
	if (dev) {
		files = fs.readdirSync('src/collections').filter((x) => !['index.ts', 'types.ts', 'Auth.ts', 'config.ts'].includes(x));
	} else {
		files = fs.readdirSync('build/collections').filter((x) => !['index.ts', 'types.ts', 'Auth.ts', 'config.ts'].includes(x));
	}
	for (let file of files) {
		if (dev) {
			imports[file] = null;
		} else {
			imports[file] = fs.readFileSync(`build/collections/${file}`, 'utf-8');
		}
	}
	return imports;
}
