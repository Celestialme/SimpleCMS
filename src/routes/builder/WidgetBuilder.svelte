<script lang="ts">
	import Button from '@src/components/system/buttons/Button.svelte';
	import AddWidget from './AddWidget.svelte';
	import WidgetFields from './WidgetFields.svelte';
	interface Props {
		addField?: boolean;
		fields?: any;
	}

	let { addField = $bindable(false), fields = $bindable([]) }: Props = $props();
</script>

{#if addField}
	<AddWidget bind:fields bind:addField />
{:else}
	<div class="text-center max-h-[calc(100vh-210px)]">
		<Button class="text-white" onclick={() => (addField = true)}>Add Field</Button>
		<WidgetFields bind:fields />
	</div>
{/if}
