<script lang="ts">
	import { page } from '$app/stores';
	import collections, { collection, setup } from '@src/collections';
	import type { Schema } from '@src/collections/types';
	import { contentLanguage } from '@src/stores/store';

	contentLanguage.set($page.params.language);
	let finished = false;
	setup().then(() => {
		collection.set($collections.find((x) => x.name === $page.params.collection) as Schema); // current collection
		//console.log($collection);
		finished = true;
	});
</script>

{#if finished}
	<slot />
{/if}
