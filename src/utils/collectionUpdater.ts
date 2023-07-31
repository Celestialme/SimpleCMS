import { exec } from 'child_process';
import fs from 'fs';
let files: Array<string> = [];
let saveFiles: Array<string> = [];

export async function updateImports() {
	files = fs.readdirSync('./src/collections').filter((x) => !['index.ts', 'types.ts', 'Auth.ts'].includes(x));
	let indexFile = fs.readFileSync('./src/collections/index.ts', 'utf-8');
	indexFile = indexFile.replace(/import \w+ from ["']\.\/.*;\s?/g, '').replace(/let allCollections\s?=\s?.*/g, '');
	let imports = '';
	let allCollections = ' let allCollections=[';
	for (let file of files) {
		let name = file.replace('.ts', '');
		imports += `import ${name} from './${name}';\n`;
		allCollections += `${name},`;
	}
	allCollections = allCollections.substring(0, allCollections.length - 1) + ']';
	if (!compare(files, saveFiles)) {
		fs.writeFileSync('./src/collections/index.ts', imports + '\n' + allCollections + '\n' + indexFile);
		saveFiles = files;
		exec('npx prettier  ./src/collections --write');
	}
}

function compare(arr1, arr2) {
	arr1.sort();
	arr2.sort();
	if (arr1.length !== arr2.length) {
		return false;
	}

	for (let i = 0; i < arr1.length; i++) {
		if (arr1[i] !== arr2[i]) {
			return false;
		}
	}

	return true;
}
