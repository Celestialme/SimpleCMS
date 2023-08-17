import fs from 'fs';

export async function updateImports() {
	// Read all files in the './src/collections' directory
	const files = fs
		.readdirSync('./src/collections')
		// Filter out the files named 'index.ts', 'types.ts', 'Auth.ts', and 'config.ts'
		.filter((x) => !['index.ts', 'types.ts', 'Auth.ts', 'config.ts'].includes(x));

	// Read the contents of the './src/collections/types.ts' file
	let typesFile = fs.readFileSync('./src/collections/types.ts', 'utf-8');

	// Map the remaining file names to a string of union types
	const imports = files.map((x) => `"${x.replace('.ts', '')}"`).join(' | ');

	// Update the 'Imports' type in the 'types.ts' file with the new string of union types
	typesFile = typesFile.replace(/type Imports\s*=\s*.*;/, 'type Imports = ' + imports + ';');

	// Write the updated 'types.ts' file back to disk
	fs.writeFileSync('./src/collections/types.ts', typesFile);
}
