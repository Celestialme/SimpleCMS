<script lang="ts">
	import { page } from '$app/stores';
	import collectionsArray, { collection } from '@src/collections';
    import { collections } from '@src/stores/collections';
	import type { Schema } from '@src/collections/types';
	import { contentLanguage } from '@src/stores/load';

	contentLanguage.set($page.params.language);
	let finished = false;
	collections.updateCollection().then(() => {
		collection.set(collectionsArray.find((x) => x.name === $page.params.collection) as Schema); // current collection
		console.log($collection);
		finished = true;
	});
</script>

{#if finished}
	<slot />
{/if}
