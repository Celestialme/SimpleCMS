import { browser } from '$app/environment';
let files: Array<string> = [];
let saveFiles: Array<string> = [];
export async function setup() {
	if (browser) {
		return;
	}

	let fs = (await import('fs')).default;
	files = fs.readdirSync('./src/collections').filter((x) => !['index.ts', 'types.ts', 'Auth.ts'].includes(x));
	let index = fs.readFileSync('./src/collections/index.ts', 'utf-8');
	index = index.replace(/import \w+ from ["']\.\/.*;\s?/g, '');
	let imports = '';
	for (let file of files) {
		let name = file.replace('.ts', '');
		imports += `import ${name} from './${name}';\n`;
	}
	console.log(imports + '\n' + index);
	if (!compare(files, saveFiles)) {
		fs.writeFileSync('./src/collections/index.ts', imports + '\n' + index);
		saveFiles = files;
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
