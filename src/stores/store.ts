import env from '@root/env';
import collections from '@src/collections';
import { setLocale } from '@src/i18n/i18n-svelte';
import type { Locales } from '@src/i18n/i18n-types';
import { loadAllLocales } from '@src/i18n/i18n-util.sync';
import { writable, type Writable } from 'svelte/store';

export let credentials: Writable<{ username: string; session: string }> = writable(
	JSON.parse(window.localStorage.getItem('credentials') || '{"username":null,"session":null}')
);
export let systemLanguage: Writable<string> = writable(env.SYSTEMLANGUAGE);
credentials.subscribe((val) => {
	window.localStorage.setItem('credentials', JSON.stringify(val));
});
loadAllLocales();
systemLanguage.subscribe((val) => {
	setLocale(val as Locales);
});

export let collection = writable(collections[0]); // current collection
export let collectionValue: any = writable({}); // collective data of collection
export let mode: Writable<'view' | 'edit'> = writable('view');
