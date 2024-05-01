import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { paraglide } from '@inlang/paraglide-js-adapter-vite';
import { fileURLToPath } from 'url';
import Path from 'path';
import { compile } from './src/routes/api/compile/compile';
import { generateCollectionTypes } from './src/utils/collectionTypes';
const __filename = fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename);
let parsed = Path.parse(__dirname);
let collectionsFolderJS =
	'/' + __dirname.replace(parsed.root, '').replaceAll('\\', '/') + '/collections/';
let collectionsFolderTS =
	'/' + __dirname.replace(parsed.root, '').replaceAll('\\', '/') + '/src/collections/';
compile({ collectionsFolderJS, collectionsFolderTS });
export default defineConfig({
	plugins: [
		sveltekit(),
		{
			name: 'vite:server',

			configureServer(server) {
				server.watcher.on('add', generateCollectionTypes);
				server.watcher.on('unlink', generateCollectionTypes);
			},

			async config() {
				return {
					define: {
						'import.meta.env.collectionsFolderJS': JSON.stringify(collectionsFolderJS),
						'import.meta.env.collectionsFolderTS': JSON.stringify(collectionsFolderTS)
					}
				};
			}
		},
		paraglide({
			project: './project.inlang', //Path to your inlang project
			outdir: './src/paraglide' //Where you want the generated files to be placed
		})
	],
	server: {
		fs: { allow: ['static', '.'] }
	}
});
