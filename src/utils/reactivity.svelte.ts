import { untrack } from 'svelte';

interface StoreFunction<T> {
	(): T;
	value: T;
	update: (f: (value: T) => T) => void;
	subscribe: (f: (value: T) => void) => () => void;
	set: (value: T) => void;
	trigger: () => void;
}
export function store<T>(v?: T) {
	let value = $state(v) as T;
	let f = (() => value) as StoreFunction<T>;

	f.update = (f) => {
		value = f(value);
	};
	f.set = (v: T) => {
		value = v;
	};
	f.subscribe = (f) => {
		return $effect.root(() => {
			track(
				() => f(value),
				() => value
			);
		});
	};
	f.trigger = () => {
		let _value = value;
		value = null as any;
		value = _value;
	};

	Object.defineProperty(f, 'value', {
		get: () => value,
		set: (v) => (value = v)
	});
	return f;
}

export function track(f: () => unknown, deps: () => any) {
	$effect(() => {
		untrack(f);
		deps();
	});
}
