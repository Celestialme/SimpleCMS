import { browser } from '$app/environment';
import env from '@root/env';
import { setLocale } from '@src/i18n/i18n-svelte';
import type { Locales } from '@src/i18n/i18n-types';
import { loadAllLocales } from '@src/i18n/i18n-util.sync';
import { writable, type Writable } from 'svelte/store';
export let credentials: Writable<{ username: string }> = writable();

export let systemLanguage: Writable<string> = writable(env.SYSTEMLANGUAGE);

credentials.subscribe((val) => {
	if (browser) globalThis.localStorage.setItem('credentials', JSON.stringify(val));
});
loadAllLocales();
systemLanguage.subscribe((val) => {
	setLocale(val as Locales);
});
