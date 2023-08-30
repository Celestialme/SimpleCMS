<script lang="ts">
	import { getCollections } from '@src/collections';
</script>

{#await getCollections()}
	<p />
{:then}
	<slot />
{/await}
