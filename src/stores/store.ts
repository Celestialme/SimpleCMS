import { writable, type Writable } from 'svelte/store';
import { PUBLIC_SYSTEM_LANGUAGE, PUBLIC_CONTENT_LANGUAGES } from '$env/static/public';
import { setLocale } from '@src/i18n/i18n-svelte';
import type { Locales } from '@src/i18n/i18n-types';
import { loadAllLocales } from '@src/i18n/i18n-util.sync';
//import { browser } from '$app/environment';
import type { User } from '@src/collections/Auth';

// Create a writable store for user with initial value from local storage
export let user: Writable<User> = writable();
//export let credentials: Writable<{ username: string }> = writable();

// Create a writable store for systemLanguage with initial value of PUBLIC_SYSTEM_LANGUAGE
export let systemLanguage: Writable<string> = writable(PUBLIC_SYSTEM_LANGUAGE);

// Create a writable store for contentLanguage with initial value of PUBLIC_CONTENT_LANGUAGES
export let contentLanguage = writable(Object.keys(JSON.parse(PUBLIC_CONTENT_LANGUAGES))[0]);

// Subscribe to changes in credentials store and update local storage accordingly

// Load all locales
loadAllLocales();

// Subscribe to changes in systemLanguage store and set locale accordingly
systemLanguage.subscribe((val) => {
	setLocale(val as Locales);
});

// collective data of collection
export let collectionValue: any = writable({});
export let mode: Writable<'view' | 'edit' | 'create' | 'delete' | 'publish' | 'unpublish' | 'schedule' | 'clone'> = writable('view');
export let entryData: Writable<any> = writable({});
export let deleteEntry: Writable<() => any> = writable(() => {});

// Store image data while editing
export const saveEditedImage: Writable<boolean> = writable(false);

// Store for Sidebars
export const toggleLeftSidebar: Writable<boolean> = writable(true);
export const toggleRightSidebar: Writable<boolean> = writable(true);
export const toggleHeaderSidebar: Writable<boolean> = writable(false);
export const toggleFooterSidebar: Writable<boolean> = writable(false);
export const switchSideBar: Writable<boolean> = writable(true);

// Store ListboxValue
export const storeListboxValue: Writable<string> = writable('create');
