<script lang="ts">
	import { page } from '$app/stores';
	import { collection, collections, contentLanguage } from '@src/stores/store.svelte';
	import { mode } from '@src/stores/store.svelte';

	mode.set('view');
	contentLanguage.set($page.params.language as any);
	collection.set(collections()[$page.params.collection]);
	let { children } = $props();
</script>

{@render children()}
