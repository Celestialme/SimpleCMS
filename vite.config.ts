import { sveltekit } from '@sveltejs/kit/vite';

import { defineConfig } from 'vite';
import { paraglide } from '@inlang/paraglide-js-adapter-vite';
import { fileURLToPath } from 'url';
import Path from 'path';
import { compile } from './src/routes/api/compile/compile';
import { generateCollectionFieldTypes, generateCollectionTypes } from './src/utils/collectionTypes';

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
			transform(code, id) {
				if (id.endsWith('.svelte')) {
					return {};
				}
			},
			configureServer(server) {
				let cb = (path: string) => {
					if (!/src[/\\]collections/.test(path)) {
						return;
					}

					compile({ collectionsFolderJS, collectionsFolderTS });
					generateCollectionTypes();
					generateCollectionFieldTypes();
				};
				server.watcher.on('add', cb);
				server.watcher.on('unlink', cb);
				server.watcher.on('change', (path) => {
					if (!/src[/\\]collections/.test(path) || path.includes('types.ts')) {
						return;
					}

					generateCollectionFieldTypes();
				});
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
		fs: { allow: ['static', '.'] }
	}
});
