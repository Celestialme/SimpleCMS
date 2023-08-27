import { building, dev } from '$app/environment';
import fs from 'fs';

// Define getCollections function
export function getCollections() {
	// Return early if building
	if (building) return;

	// Initialize variables
	let files: any;
	const imports = {} as any;

	// Read collection files from src or build directory depending on dev environment
	if (dev) {
		files = fs
			.readdirSync('src/collections')
			.filter((x) => !['index.ts', 'types.ts', 'Auth.ts', 'config.ts'].includes(x));
	} else {
		files = fs
			.readdirSync('build/collections')
			.filter((x) => !['index.ts', 'types.ts', 'Auth.ts', 'config.ts'].includes(x));
	}

	// Add collection files to imports object
	for (const file of files) {
		if (dev) {
			imports[file] = null;
		} else {
			imports[file] = fs.readFileSync(`build/collections/${file}`, 'utf-8');
		}
	}

	// Return imports object
	return imports;
}
