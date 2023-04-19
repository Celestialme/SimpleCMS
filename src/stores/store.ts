import { writable, type Writable } from 'svelte/store';
// export let collection = writable(collections?.[0]); // current collection
export let collectionValue: any = writable({}); // collective data of collection
export let mode: Writable<'view' | 'edit' | 'create'> = writable('view');
export let entryValue: Writable<any> = writable({});
