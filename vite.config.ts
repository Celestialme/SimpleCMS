import { sveltekit } from '@sveltejs/kit/vite';
import Path from 'path';

// Gets package.json version info on app start
// https://kit.svelte.dev/faq#read-package-json
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

//github Version package.json check
const file = fileURLToPath(new URL('package.json', import.meta.url));
const json = readFileSync('package.json', 'utf8');
const pkg = JSON.parse(json);

// collection updater
import type vite from 'vite';
import { updateImports } from './src/utils/collectionUpdater';

const myPlugin = {
	name: 'log-request-middleware',
	configureServer(server) {
		server.watcher.addListener('all', (event, path) => {
			if (event == 'change') return;
			if (!path.includes('src\\collections') && !path.includes('src/collections')) return;

			console.log(event, path);
			updateImports();
		});
	}
} as vite.Plugin;

const config = {
	plugins: [myPlugin, sveltekit()],

	server: { fs: { allow: ['static', '.'] } },

	resolve: {
		alias: {
			'@src': Path.resolve('src/'),
			'@static': Path.resolve('static/'),
			'@root': Path.resolve('./'),
			'@i18n': Path.resolve('src/i18n')
		}
	},

	define: {
		__VERSION__: JSON.stringify(pkg.version)
	},

	output: { preloadStrategy: 'preload-mjs' }
} as vite.UserConfig;

export default config;
