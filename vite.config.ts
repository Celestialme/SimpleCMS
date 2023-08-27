import { sveltekit } from '@sveltejs/kit/vite';
import Path from 'path';
// Gets package.json version info on app start
// https://kit.svelte.dev/faq#read-package-json
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import type vite from 'vite';
import { updateImports } from './src/utils/collectionUpdater';
import axios from 'axios';
import { spawn, type ChildProcessWithoutNullStreams } from 'child_process';
import fs from 'fs';

const file = fileURLToPath(new URL('package.json', import.meta.url));
const json = readFileSync(file, 'utf8');
const pkg = JSON.parse(json);

const myPlugin = {
	name: 'log-request-middleware',
	async closeBundle() {
		console.log('closing bundle');

		await axios
			.post('http://127.0.0.1:3000/api/close')

			.catch((err) => {});
		let child = spawn('node', ['server.js'], { detached: true });

		child.stdout.on('data', (data) => {
			console.log(data.toString());
		});
		child.stderr.on('data', (data) => {
			console.log(data.toString());
		});
	}
} as vite.Plugin;

const config = {
	plugins: [sveltekit(), myPlugin],

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
