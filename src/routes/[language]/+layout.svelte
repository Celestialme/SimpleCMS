<script lang="ts">
	import { getCollections } from '@src/collections';
	import { page } from '$app/stores';
	import { contentLanguage } from '@src/stores/store.svelte';
	import { mode } from '@src/stores/store.svelte';
	console.log(mode.set);
	mode.set('view');
	contentLanguage.set($page.params.language as any);
	let { children } = $props();
</script>

{#await getCollections() then _}
	{@render children()}
{/await}
