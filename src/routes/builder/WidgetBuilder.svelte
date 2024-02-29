<script>
	import Button from '@src/components/system/buttons/Button.svelte';
	import AddWidget from './AddWidget.svelte';
	import WidgetFields from './WidgetFields.svelte';
	export let addField = false;
	export let fields = [];
	$: console.log(fields);
</script>

{#if addField}
	<AddWidget {fields} bind:addField />
{:else}
	<div class="text-center">
		<Button class="text-white" on:click={() => (addField = true)}>Add Field</Button>
		<WidgetFields bind:fields />
	</div>
{/if}
