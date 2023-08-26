<script lang="ts">
	import { getCollections } from '@src/collections';
	import '../app.css';
	import '../theme.postcss';

</script>
{#await getCollections()}
<p></p>
{:then}
<slot />
{/await}
