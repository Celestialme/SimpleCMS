import { building, dev } from '$app/environment';
import fs from 'fs';

export function getCollections() {
	// If building, exit the function
	if (building) return;
	let files: any;

	const imports = {} as any;

	if (dev) {
		// In development environment
		files = fs
			// Read the contents of 'src/collections' directory
			.readdirSync('src/collections')
			// Exclude specific files
			.filter((x) => !['index.ts', 'types.ts', 'Auth.ts', 'config.ts'].includes(x));
	} else {
		// In production environment
		files = fs
			// Read the contents of 'build/collections' directory
			.readdirSync('build/collections')
			// Exclude specific files
			.filter((x) => !['index.ts', 'types.ts', 'Auth.ts', 'config.ts'].includes(x));
	}

	for (const file of files) {
		if (dev) {
			// In development, initialize imports with null
			imports[file] = null;
		} else {
			// In production, read file contents and store in imports
			imports[file] = fs.readFileSync(`build/collections/${file}`, 'utf-8');
		}
	}
	// Return the imports
	return imports;
}
