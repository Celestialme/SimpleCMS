import { writable, type Writable } from 'svelte/store';
export let collectionValue: any = writable({}); // collective data of collection
export let mode: Writable<'view' | 'edit' | 'create' | 'modify'> = writable('view');
export let entryData: Writable<any> = writable({});
export let modifyEntry: Writable<(status: keyof typeof statusMap) => any> = writable(() => {});
export let drawerExpanded: Writable<Boolean> = writable(true);
export let statusMap = {
	Delete: 'deleted',
	Publish: 'published',
	Unpublish: 'unpublished',
	Schedule: 'scheduled',
	Clone: 'cloned',
	Test: 'testing'
};
