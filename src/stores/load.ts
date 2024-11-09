import publicConfig from '@root/config/public';

import type { Schema } from '@src/collections/types';
import * as m from '@src/paraglide/messages.js';
import { setLanguageTag, type AvailableLanguageTag } from '@src/paraglide/runtime';
import type { ChildProcessWithoutNullStreams } from 'child_process';
import { writable, type Writable } from 'svelte/store';
export let systemLanguage: Writable<AvailableLanguageTag> = writable(
	publicConfig.DEFAULT_SYSTEM_LANGUAGE
) as any;
export let messages: Writable<typeof m> = writable({ ...m });

export let unAssigned: Writable<Array<Schema>> = writable();
export let saveFunction: Writable<{ fn: (args: any) => any; reset: () => any }> = writable({
	fn: () => {},
	reset: () => {}
});
export const tableHeaders = ['id', 'email', 'username', 'role', 'createdAt'] as const;
export let headerActionButton: Writable<ConstructorOfATypedSvelteComponent | string> = writable();
export let indexer: ChildProcessWithoutNullStreams;
systemLanguage.subscribe((val) => {
	setLanguageTag(val);
	messages.set({ ...m });
});
