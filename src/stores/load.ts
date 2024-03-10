import publicConfig from '@root/config/public';
import type { Schema } from '@src/collections/types';
import * as m from '@src/paraglide/messages.js';
import { setLanguageTag, type AvailableLanguageTag } from '@src/paraglide/runtime';
import { writable, type Writable } from 'svelte/store';
export let systemLanguage: Writable<AvailableLanguageTag> = writable(publicConfig.DEFAULT_SYSTEM_LANGUAGE) as any;
export let messages: Writable<typeof m> = writable({ ...m });
export let contentLanguage: Writable<string> = writable(publicConfig.DEFAULT_CONTENT_LANGUAGE);
export let categories: Writable<
	Array<{
		name: string;
		icon: string;
		collections: Array<Schema>;
	}>
> = writable();
export let collections: Writable<Array<Schema>> = writable();
export let unAssigned: Writable<Array<Schema>> = writable();
export let collection: Writable<Schema> = writable();
export let saveFunction: Writable<{ fn: (args: any) => any; reset: () => any }> = writable({ fn: () => {}, reset: () => {} });
export const tableHeaders = ['id', 'email', 'username', 'role', 'createdAt'] as const;
export let headerActionButton: Writable<ConstructorOfATypedSvelteComponent | string> = writable();
systemLanguage.subscribe((val) => {
	setLanguageTag(val);
	messages.set({ ...m });
});
