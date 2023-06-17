import { writable, type Writable } from 'svelte/store';
import { PUBLIC_LANGUAGE } from '$env/static/public';

export let collectionValue: any = writable({}); // collective data of collection
export let mode: Writable<'view' | 'edit' | 'create' | 'delete' | 'publish' | 'unpublish' | 'schedule' | 'clone'> = writable('view');
export let entryData: Writable<any> = writable({});
export let deleteEntry: Writable<() => any> = writable(() => {});

// Store selected content language
export const language: Writable<string> = writable(PUBLIC_LANGUAGE);

// Store image data while editing
export const saveEditedImage: Writable<boolean> = writable(false);

// Store for Sidebars
export const toggleLeftSidebar: Writable<boolean> = writable(true);
export const toggleRightSidebar: Writable<boolean> = writable(true);
export const toggleHeaderSidebar: Writable<boolean> = writable(false);
export const toggleFooterSidebar: Writable<boolean> = writable(false);
export const switchSideBar: Writable<boolean> = writable(true);

// Store detault SystemLanguage
export const systemLanguage: Writable<string> = writable('en');

// Store to Check First User Exist
export const firstuserExist: Writable<boolean> = writable(false);
