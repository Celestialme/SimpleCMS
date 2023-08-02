<script>
	import Button from '@src/components/system/buttons/Button.svelte';
	import AddWidget from './AddWidget.svelte';
	import FloatingInput from '@src/components/system/inputs/FloatingInput.svelte';
	import WidgetFields from './WidgetFields.svelte';
	export let collectionName = '';
	export let addField = false;
	export let fields = [];
</script>

{#if addField}
	<AddWidget {fields} bind:addField />
{:else}
	<div class="text-center">
		<Button class="text-white" on:click={() => (addField = true)}>Add Field</Button>
		<FloatingInput theme="dark" label="name" name="name" bind:value={collectionName} />
		<WidgetFields {fields} />
	</div>
{/if}
