import { sveltekit } from '@sveltejs/kit/vite';
import { paraglide } from '@inlang/paraglide-js-adapter-vite';
import Path from 'path';
// Gets package.json version info on app start
// https://kit.svelte.dev/faq#read-package-json
import { readFileSync } from 'fs';
import type vite from 'vite';
import { fileURLToPath } from 'url';
import { compile } from './src/routes/api/compile/compile';
import { generateCollectionTypes } from './src/utils/collectionTypes';
const __filename = fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename);
let parsed = Path.parse(__dirname);
let collectionsFolderJS = '/' + __dirname.replace(parsed.root, '').replaceAll('\\', '/') + '/collections/';
let collectionsFolderTS = '/' + __dirname.replace(parsed.root, '').replaceAll('\\', '/') + '/src/collections/';
const file = fileURLToPath(new URL('package.json', import.meta.url));
const json = readFileSync(file, 'utf8');
const pkg = JSON.parse(json);
compile({ collectionsFolderJS, collectionsFolderTS });

const config = {
	plugins: [
		{
			name: 'vite:server',
			configureServer(server) {
				server.watcher.on('add', generateCollectionTypes);
				server.watcher.on('unlink', generateCollectionTypes);
			},

			config() {
				return {
					define: {
						'import.meta.env.collectionsFolderJS': JSON.stringify(collectionsFolderJS),
						'import.meta.env.collectionsFolderTS': JSON.stringify(collectionsFolderTS)
					}
				};
			}
		},
		sveltekit(),
		paraglide({
			project: './project.inlang', //Path to your inlang project
			outdir: './src/paraglide' //Where you want the generated files to be placed
		})
	],

	server: {
		fs: { allow: ['static', '.'] }
	},

	resolve: {
		alias: {
			'@src': Path.resolve('src/'),
			'@static': Path.resolve('static/'),
			'@root': Path.resolve('./')
		}
	},

	define: {
		__VERSION__: JSON.stringify(pkg.version)
	}
} as vite.UserConfig;

export default config;
