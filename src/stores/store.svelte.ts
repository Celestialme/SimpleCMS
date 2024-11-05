import { untrack } from 'svelte';

export let entryData = store({} as { [key: string]: any });
export let mode = store('view' as 'view' | 'edit' | 'create' | 'modify' | 'storage');
export let translationProgress = store({
	show: false
} as { [key: string]: { total: any[]; translated: any[] } } | { show: boolean });
export function store<T>(v: T) {
	let value = $state(v);
	return {
		get value() {
			return value;
		},
		set value(v) {
			value = v;
		},
		set(v) {
			value = v;
		},
		update(f) {
			value = f(value);
		},
		subscribe(f) {
			let _f = untrack(() => f);
			return $effect.root(() => {
				$effect(() => {
					_f(value);
				});
			});
		}
	};
}
