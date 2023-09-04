import adapter from '@sveltejs/adapter-node'; // To generate a standalone Node server
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
			out: 'build', // default: true | The directory to build the server to
			precompress: true, // default: false | Enables precompressing using gzip &  brotli for assets & prerendered pages
			envPrefix: '', // default: '' | If you need to change the name of the environment variables used to configure the deployment
			polyfill: false // default: true | should be disabled when using Node 18.11 or greatere
		}),
		csrf: {
			checkOrigin: false // default: true | Protection against cross-site request forgery (CSRF) attacks.
		}
	},

	// plugin options
	vitePlugin: {
		// remove inspector for production
		inspector: {
			// change shortcut
			toggleKeyCombo: 'meta-shift',
			// hold and release key to toggle inspector mode
			holdMode: true,
			// show or hide the inspector option
			showToggleButton: 'always',
			// inspector position
			toggleButtonPos: 'bottom-right'
		},
		exclude: [],
		// experimental options
		experimental: {}
	}
};

export default config;
