import { writable, type Writable } from 'svelte/store';
import { loadAllLocales } from '@src/i18n/i18n-util.sync';	
import {setLocale} from '@src/i18n/i18n-svelte'
import type { Locales } from '@src/i18n/i18n-types';

import env from '@root/env';

export let entryData: any = writable(undefined);
export let MenuCurrentChild: Writable<any> = writable(undefined);
export let getFieldsData: Writable<Set<() => Promise<any>>> = writable(new Set());
export let language: Writable<string> = writable(env.LANGUAGE);
export let systemLanguage: Writable<string> = writable(env.SYSTEMLANGUAGE);

export let credentials: Writable<{ username: string; session: string }> = writable(
	JSON.parse(window.localStorage.getItem('credentials') || '{"username":null,"session":null}')
);
export let is_dark: Writable<boolean> = writable(
	JSON.parse(window.localStorage.getItem('is_dark') || 'true')
);
credentials.subscribe((val) => {
	window.localStorage.setItem('credentials', JSON.stringify(val));
});
loadAllLocales()
systemLanguage.subscribe((val) => {
	setLocale(val as Locales);
})