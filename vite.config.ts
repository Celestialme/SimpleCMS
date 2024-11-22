import { sveltekit } from '@sveltejs/kit/vite';

import { defineConfig } from 'vite';
import { paraglide } from '@inlang/paraglide-js-adapter-vite';
import { fileURLToPath } from 'url';
import Path from 'path';
import { generateCollectionTypes } from './src/utils/collectionTypes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename);
let parsed = Path.parse(__dirname);
let collectionsFolderJS =
	'/' + __dirname.replace(parsed.root, '').replaceAll('\\', '/') + '/collections/';
let collectionsFolderTS =
	'/' + __dirname.replace(parsed.root, '').replaceAll('\\', '/') + '/src/collections/';

export default defineConfig({
	plugins: [
		sveltekit(),

		{
			name: 'vite:server',

			configureServer(server) {
				let cb = (path: string) => {
					if (!/src[/\\]collections/.test(path)) {
						return;
					}

					generateCollectionTypes(server);
				};
				server.watcher.on('add', cb);
				server.watcher.on('unlink', cb);
				server.watcher.on('change', cb);
			},

			async config() {
				return {
					define: {
						'import.meta.env.collectionsFolderJS': JSON.stringify(collectionsFolderJS),
						'import.meta.env.collectionsFolderTS': JSON.stringify(collectionsFolderTS),
						'import.meta.env.root': JSON.stringify(
							'/' + __dirname.replace(parsed.root, '').replaceAll('\\', '/')
						)
					}
				};
			},
			enforce: 'post'
		},
		paraglide({
			project: './project.inlang', //Path to your inlang project
			outdir: './src/paraglide' //Where you want the generated files to be placed
		})
	],
	server: {
		proxy: {
			'/search': 'http://localhost:8000'
		},
		fs: { allow: ['static', '.'] }
	}
});
