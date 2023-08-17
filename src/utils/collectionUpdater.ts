import fs from 'fs';

export async function updateImports() {
	let files = fs.readdirSync('./src/collections').filter((x) => !['index.ts', 'types.ts', 'Auth.ts', 'config.ts'].includes(x));
	let typesFile = fs.readFileSync('./src/collections/types.ts', 'utf-8');
	let imports = files.map((x) => `"${x.replace('.ts', '')}"`).join(' | ');
	typesFile = typesFile.replace(/type Imports\s*=\s*.*;/, 'type Imports = ' + imports + ';');
	fs.writeFileSync('./src/collections/types.ts', typesFile);
}
