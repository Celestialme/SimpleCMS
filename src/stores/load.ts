import { PUBLIC_CONTENT_LANGUAGES, PUBLIC_AVAILABLE_SYSTEMLANGUAGES } from '$env/static/public';
import type { Schema } from '@src/collections/types';
import { derived, get, writable, type Writable } from 'svelte/store';

//paraglidejs
import { sourceLanguageTag, availableLanguageTags } from '@src/paraglide/runtime';

// Create a writable store for contentLanguage with initial value of PUBLIC_CONTENT_LANGUAGES
export const contentLanguage = writable(Object.keys(JSON.parse(PUBLIC_CONTENT_LANGUAGES))[0]);
export const defaultContentLanguage = Object.keys(JSON.parse(PUBLIC_CONTENT_LANGUAGES))[0];

// Create a writable store for systemLanguage
export const systemLanguage = writable(globalThis?.localStorage?.getItem('systemLanguage') || sourceLanguageTag);

//Filter systemLanguage via environment file
export const AVAILABLE_SYSTEMLANGUAGES = PUBLIC_AVAILABLE_SYSTEMLANGUAGES
	? (JSON.parse(PUBLIC_AVAILABLE_SYSTEMLANGUAGES) as string[])
	: availableLanguageTags; // default value

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

// Create a writable store for toggleLeftSidebar
export const toggleLeftSidebar = writable('closed');

// Add a click method to the toggleLeftSidebar store
toggleLeftSidebar.click = () => {
	toggleLeftSidebar.update((n) => {
		if (n === 'closed') {
			return 'collapsed';
		} else if (n === 'collapsed') {
			return 'full';
		} else {
			return 'closed';
		}
	});
};
// Calculate the sidebar state based on the window width and the toggleLeftSidebar store
const sidebarState = derived([toggleLeftSidebar], ([$toggleLeftSidebar]) => {
	if ($toggleLeftSidebar === 'closed') {
		return 'closed';
	} else if ($toggleLeftSidebar === 'collapsed' && window.innerWidth >= 1024) {
		return 'collapsed';
	} else {
		return 'full';
	}
});

// Update the sidebar state when the window is resized
if (typeof window !== 'undefined') {
	window.addEventListener('resize', () => {
		toggleLeftSidebar.set(get(sidebarState));
	});
}

// Expose the sidebar state as a readable store
export const $toggleLeftSidebar = derived(toggleLeftSidebar, ($toggleLeftSidebar) => {
	return $toggleLeftSidebar;
});
