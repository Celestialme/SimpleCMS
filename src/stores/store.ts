import { writable, type Writable } from 'svelte/store';
export let collectionValue: any = writable({}); // collective data of collection
export let mode: Writable<'view' | 'edit' | 'create' | 'delete'> = writable('view');
export let entryData: Writable<any> = writable({});
export let deleteEntry: Writable<() => any> = writable(() => {});
