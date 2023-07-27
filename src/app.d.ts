// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}

	type DISPLAY = ((data: any, field: any, entry: any, contentLanguage: string) => Promise<any>) & { default?: boolean };
}
export {};
