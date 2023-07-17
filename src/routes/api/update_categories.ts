import fs from 'fs/promises';

export async function post(req, res) {
	const categories = req.body;

	const data = `export const categories = ${JSON.stringify(categories, null, 2)};`;
	await fs.writeFile('./src/collections/categories.ts', data);

	res.send('Categories updated');
}
