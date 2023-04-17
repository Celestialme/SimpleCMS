import { sveltekit } from '@sveltejs/kit/vite';
import Path from 'path';

// Gets package.json version info on app start
// https://kit.svelte.dev/faq#read-package-json
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
const file = fileURLToPath(new URL('package.json', import.meta.url));
const json = readFileSync(file, 'utf8');
const pkg = JSON.parse(json);


/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],

	server: { fs: { allow: ['static', '.'] } },
	
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
};
export default config;
