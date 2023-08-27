import { server } from './build/index.js';
import fs from 'fs';
import serve from 'serve-static';
import path from 'path';
import ts from 'typescript';
server.get('/api/getCollections', (req, res) => {
	let files = fs.readdirSync('./collections');
	files = files.filter((file) => file !== 'config.js');
	res.end(JSON.stringify(files));
});
server.get('/api/compile', (req, res) => {
	let files = fs.readdirSync('./src/collections').filter((file) => !['Auth.ts', 'index.ts'].includes(file));
	for (let file of files) {
		let content = fs.readFileSync(`./src/collections/${file}`, { encoding: 'utf-8' });
		let code = ts.transpileModule(content, {
			compilerOptions: {
				target: 'esnext'
			}
		}).outputText;
		code = code
			.replace(/import widgets from .*\n/g, '')
			.replace(/widgets/g, 'globalThis.widgets')
			.replace(/(\bfrom\s+["']\..*)(["'])/g, '$1.js$2');
		fs.writeFileSync(`./collections/${file.trim().replace(/\.ts$/g, '.js')}`, code);
	}
	res.end(JSON.stringify(files));
});
server.use('/api/collections', serve('./collections'));
server.routes.reverse();
