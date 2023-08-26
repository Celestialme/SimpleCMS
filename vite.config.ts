import { sveltekit } from '@sveltejs/kit/vite';
import Path from 'path';
// Gets package.json version info on app start
// https://kit.svelte.dev/faq#read-package-json
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import type vite from 'vite';
import { updateImports } from './src/utils/collectionUpdater';
const file = fileURLToPath(new URL('package.json', import.meta.url));
const json = readFileSync(file, 'utf8');
const pkg = JSON.parse(json);

const myPlugin = {
	name: 'log-request-middleware',
	configureServer(server) {
		server.watcher.addListener('all', (event, path) => {
			if (event == 'change') return;
			if (!path.includes('src\\collections') && !path.includes('src/collections')) return;
			console.log(event, path);
			// updateImports();
		});
	}
} as vite.Plugin;

const config = {
	plugins: [myPlugin, sveltekit()],

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
