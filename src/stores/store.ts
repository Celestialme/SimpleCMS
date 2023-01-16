import { writable, type Writable } from 'svelte/store';
import env from '@root/env';

export let entryData: any = writable(undefined);
export let MenuCurrentChild: Writable<any> = writable(undefined);
export let getFieldsData: Writable<Set<() => Promise<any>>> = writable(new Set());
export let language: Writable<string> = writable(env.LANGUAGE);

export let languageSystem: Writable<string> = writable(env.LANGUAGESYSTEM);

export let credentials: Writable<{ username: string; session: string }> = writable(
	JSON.parse(window.localStorage.getItem('credentials') || '{"username":null,"session":null}')
);
export let is_dark: Writable<boolean> = writable(
	JSON.parse(window.localStorage.getItem('is_dark') || 'true')
);
credentials.subscribe((val) => {
	window.localStorage.setItem('credentials', JSON.stringify(val));
});
