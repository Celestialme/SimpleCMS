import { untrack } from 'svelte';
import publicConfig from '@root/config/public';
export let entryData = store({} as { [key: string]: any });
export let mode = store('view' as 'view' | 'edit' | 'create' | 'modify' | 'storage');
export let translationProgress = store({
	show: false
} as { [key: string]: { total: any[]; translated: any[] } } | { show: boolean });

export let contentLanguage = store(publicConfig.DEFAULT_CONTENT_LANGUAGE);
export let drawerExpanded = store(true);
export let collectionValue = store<any>({});
export let modifyEntry = store((status: keyof typeof statusMap): any => {});
export let statusMap = {
	Delete: 'deleted',
	Publish: 'published',
	Unpublish: 'unpublished',
	Schedule: 'scheduled',
	Clone: 'cloned',
	Test: 'testing'
};

export function store<T>(v?: T) {
	let value = $state(v) as T;
	return {
		get value() {
			return value;
		},
		set value(v) {
			value = v;
		},
		set(v: T) {
			value = v;
		},
		update(f: (value: T) => T) {
			value = f(value);
		},
		subscribe(f: (value: T) => void) {
			return $effect.root(() => {
				track(
					() => f(value),
					() => value
				);
			});
		}
	};
}

export function track(f: () => unknown, deps: () => any) {
	$effect(() => {
		untrack(f);
		deps();
	});
}
