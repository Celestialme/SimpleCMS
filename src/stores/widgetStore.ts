import { writable, type Writable } from 'svelte/store';

export let entryValue: Writable<any> = writable({});
