import fs from 'fs/promises'; // Use fs.promises for asynchronous file operations
import path from 'path';

export async function updateConfigFile(request: any) {
	// Get the data from the request body
	const data = request.body;
	console.log('data', data);

	// Define the path to the config.ts file
	const configFilePath = path.join(process.cwd(), 'src', 'collections', 'config.ts');
	console.log('configFilePath', configFilePath);

	// Define the new content of the config.ts file
	const newConfigFileContent = `
        // Configure how Collections are sorted & displayed in Categories section
        export function createCategories(imports: any) {
            return ${JSON.stringify(data)};
        }
    `;

	try {
		// Write the new content to the config.ts file asynchronously
		await fs.writeFile(configFilePath, newConfigFileContent);

		// Return a success response
		return {
			status: 200,
			body: 'Config file updated successfully'
		};
	} catch (error) {
		// Return an error response
		return {
			status: 500,
			body: 'Error updating config file'
		};
	}
}
