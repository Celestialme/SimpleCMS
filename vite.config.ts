import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import Path from 'path';
const config: UserConfig = {
	plugins: [sveltekit()],

		server:{fs:{allow:['static',"."]}},
			resolve:{
				alias:{
					'@src':Path.resolve('src/'),
					'@static':Path.resolve('static/'),
					'@root':Path.resolve('./')
				}
			},
			
};

export default config;
