// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare global {
	/// <reference types="lucia" />
	declare namespace Lucia {
		type Auth = import('./lucia.js').Auth;
		type DatabaseUserAttributes = {};
		type DatabaseSessionAttributes = {};
	}

	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
	type DISPLAY = (data: any, field: any, entry: any, contentLanguage: string) => Promise<any>;
}
export {};
