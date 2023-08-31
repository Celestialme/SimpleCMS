import { PUBLIC_SYSTEM_LANGUAGE, PUBLIC_CONTENT_LANGUAGE } from '$env/static/public';
import type { User } from '@src/collections/Auth';
import type { Schema } from '@src/collections/types';
import { setLocale } from '@src/i18n/i18n-svelte';
import type { Locales } from '@src/i18n/i18n-types';
import { loadAllLocales } from '@src/i18n/i18n-util.sync';
import { writable, type Writable } from 'svelte/store';
export let systemLanguage: Writable<string> = writable(PUBLIC_SYSTEM_LANGUAGE);
export let contentLanguage: Writable<string> = writable(PUBLIC_CONTENT_LANGUAGE);
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
loadAllLocales();
systemLanguage.subscribe((val) => {
	setLocale(val as Locales);
});
