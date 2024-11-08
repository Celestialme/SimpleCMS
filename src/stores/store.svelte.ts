import publicConfig from '@root/config/public';
import type { Schema } from '@src/collections/types';
import { store } from '@src/utils/reactivity.svelte';
export let entryData = store({} as { [key: string]: any });
export let mode = store('view' as 'view' | 'edit' | 'create' | 'modify' | 'storage');
export let translationProgress = store({
	show: false
} as { [key: string]: { total: any[]; translated: any[] } } | { show: boolean });

export let contentLanguage = store(publicConfig.DEFAULT_CONTENT_LANGUAGE);
export let drawerExpanded = store(true);
export let collectionValue = store<any>({});
export let collection = store<Schema>();
export let modifyEntry = store((_: keyof typeof statusMap): any => {});
export let statusMap = {
	Delete: 'deleted',
	Publish: 'published',
	Unpublish: 'unpublished',
	Schedule: 'scheduled',
	Clone: 'cloned',
	Test: 'testing'
};
