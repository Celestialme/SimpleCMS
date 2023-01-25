SimpleCMS

## Developing

Clone this repository

Goto downloaded folder

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev for sveltekit
npm run server for express

# or start all
npm run start
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## place env.ts in root folder

```
import pkg from './package.json' assert { type: 'json' };

let env: {
	SITENAME: string;
	LANGUAGE: string;
	TRANSLATIONS: { [key: string]: string };
	LANGUAGESYSTEM: string;
	HOST: string;
	PORT: number;
	DB_URL: string;
	DB_NAME: string;
	DB_USER: string;
	DB_PASSWORD: string;
	DB_HOST: string;
	API: string;
	PKG: {
		VERSION: string;
	};
	MAPBOX_API_TOKEN: string;
	GOOGLE_API_TOKEN: string;
	YOUTUBE_API_KEY: string;
	VIMEO_API_KEY: string;
	TWITCH_API_KEY: string;
	TIKTOK_API_KEY: string;
} = {
	SITENAME: 'SimpleCMS',

	LANGUAGE: 'en', // defines default language
	TRANSLATIONS: { en: 'English', de: 'German' },

	LANGUAGESYSTEM: 'en', // defines default System language

	//for express
	HOST: 'http://localhost',
	PORT: 3501,

	// YOUR API_KEYs
	MAPBOX_API_TOKEN: '',
	GOOGLE_API_TOKEN: '',
	YOUTUBE_API_KEY: '',
	VIMEO_API_KEY: '',
	TWITCH_API_KEY: '',
	TIKTOK_API_KEY: '',

// for mongodb......for Atlas use DB_HOST:"mongodb+srv://XXXX",
	DB_URL: 'xxxx:27017',
	DB_NAME: 'SimpleCMS',
	DB_USER: 'username',
	DB_PASSWORD: 'password!',
	DB_HOST: 'mongodb://xxxx:27017',

	API: '',
	PKG: {
		VERSION: pkg.version
	}
};

env.API = `${env.HOST}:${env.PORT}/api`;

export default env;
```
