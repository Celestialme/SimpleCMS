<script>
	import AddWidget from '@src/routes/builder2/AddWidget.svelte';
	import FloatingInput from '@src/components/system/inputs/floatingInput.svelte';
	import WidgetFields from '@src/routes/builder2/WidgetBuilder.svelte';

	export let collectionName = '';
	export let addField = false;
	export let fields = [];
</script>

{#if addField}
	<AddWidget {fields} bind:addField />
{:else}
	<div class="text-center">
		<button class="btn text-white" on:click={() => (addField = true)}>Add Field</button>
		<FloatingInput label="name" name="name" bind:value={collectionName} />
		<WidgetFields {fields} />
	</div>
{/if}
