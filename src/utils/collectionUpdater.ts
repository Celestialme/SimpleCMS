import { browser } from '$app/environment';

let files: Array<string> = [];
let saveFiles: Array<string> = [];

// Function to set up the environment by importing and reading files
export async function setup() {
	try {
		// Check if the code is running in a browser environment
		if (browser) {
			return;
		}

		// Import the fs module
		const fs = (await import('fs')).default;

		// Read the contents of the ./src/collections directory and filter out certain files
		files = fs
			.readdirSync('./src/collections')
			.filter((x) => !['index.ts', 'types.ts', 'Auth.ts'].includes(x));

		// Read the contents of the ./src/collections/index.ts file
		let index = fs.readFileSync('./src/collections/index.ts', 'utf-8');

		// Remove any existing import statements except for the i18n-svelte import
		index = index.replace(
			/(?!import LL from '@src\/i18n\/i18n-svelte';\s+)import \w+ from .*;\s+/g,
			''
		);

		// Generate new import statements for each file in the ./src/collections directory
		let imports = '';
		for (const file of files) {
			const name = file.replace('.ts', '');
			imports += `import ${name} from './${name}';\n`;
		}
		//console.log(imports + '\n' + index);

		// Write the new import statements and original contents to the ./src/collections/index.ts file
		if (!compare(files, saveFiles)) {
			fs.writeFileSync('./src/collections/index.ts', imports + '\n' + index);
			saveFiles = files;
		}
	} catch (error) {
		// Handle any errors that might occur
		console.error(error);
	}
}

// Function to compare two arrays for equality
function compare(arr1, arr2) {
	try {
		// Sort both arrays
		arr1.sort();
		arr2.sort();

		// Check if the arrays have the same length
		if (arr1.length !== arr2.length) {
			return false;
		}

		// Compare the elements of both arrays
		for (let i = 0; i < arr1.length; i++) {
			if (arr1[i] !== arr2[i]) {
				return false;
			}
		}

		// Return true if the arrays are equal
		return true;
	} catch (error) {
		// Handle any errors that might occur
		console.error(error);
		return false;
	}
}
