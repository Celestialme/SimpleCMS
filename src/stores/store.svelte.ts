import publicConfig from '@root/config/public';
import { loadModules } from '@src/collections';
import type { Schema } from '@src/collections/types';
import { setLanguageTag, type AvailableLanguageTag } from '@src/paraglide/runtime';
import * as m from '@src/paraglide/messages.js';
import { store } from '@src/utils/reactivity.svelte';
export let entryData = store({} as { [key: string]: any });
export let mode = store('view' as 'view' | 'edit' | 'create' | 'modify' | 'storage');
export let translationProgress = store({
	show: false
} as { [key: string]: { total: any[]; translated: any[] } } | { show: boolean });
export let contentLanguage = store(publicConfig.DEFAULT_CONTENT_LANGUAGE);
export let drawerExpanded = store(true);
export let collectionValue = store<any>({});
let { collections: _collections, categories: _categories } = loadModules();
export let collections = store(_collections);
export let categories = store(_categories);
export let systemLanguage = store<AvailableLanguageTag>(publicConfig.DEFAULT_SYSTEM_LANGUAGE);
export let collection = store<Schema>({} as Schema);
export let headerActionButton = store<ConstructorOfATypedSvelteComponent | string>();
export let modifyEntry = store((_: keyof typeof statusMap): any => {});
export let statusMap = {
	Delete: 'deleted',
	Publish: 'published',
	Unpublish: 'unpublished',
	Schedule: 'scheduled',
	Clone: 'cloned',
	Test: 'testing'
};
export let saveFunction = store<{ fn: (args: any) => any; reset: () => any }>({
	fn: () => {},
	reset: () => {}
});

export let messages = store<typeof m>(m);
systemLanguage.subscribe((val) => {
	setLanguageTag(val);
	messages.trigger();
});
