<script lang="ts">
	import { getCollections } from '@src/collections';
	import { page } from '$app/stores';
	import { contentLanguage } from '@src/stores/load';
	import { mode } from '@src/stores/store';
	mode.set('view');
	contentLanguage.set($page.params.language);
	let { children } = $props();
</script>

{#await getCollections() then _}
	{@render children()}
{/await}
