<script lang="ts">
	import DropDown from '@src/components/system/dropDown/DropDown.svelte';
	import widgets from '@src/components/widgets';
	import InputSwitch from './InputSwitch.svelte';
	import Button from '@src/components/system/buttons/Button.svelte';
	import { asAny } from '@src/utils/utils';
	import XIcon from '@src/components/system/icons/XIcon.svelte';
	export let fields: Array<any> = [];
	export let addField: Boolean = false;
	let selected_widget: keyof typeof widgets | null = null;
	let widget_keys = Object.keys(widgets) as unknown as keyof typeof widgets;

	let guiSchema: (typeof widgets)[typeof widget_keys]['GuiSchema'];
	$: if (selected_widget) {
		guiSchema = widgets[selected_widget].GuiSchema;
	}
	let field = { label: '', widget: { key: selected_widget as unknown as keyof typeof widgets, GuiFields: {} } };
</script>

{#if !selected_widget}
	<div class="properties">
		<button class="ml-auto mr-[40px] mb-[20px]" on:click={() => (addField = false)}><XIcon /></button>
		<DropDown items={widget_keys} bind:selected={selected_widget} label="Select Widget" />
	</div>
{:else}
	<div class="properties">
		<button class="ml-auto mr-[40px]" on:click={() => (selected_widget = null)}><XIcon /></button>

		{#each Object.entries(guiSchema) as [property, value]}
			<InputSwitch bind:value={field.widget.GuiFields[property]} widget={asAny(value).widget} key={property} />
		{/each}
		<Button
			on:click={() => {
				if (!selected_widget) return;
				field.widget = { key: selected_widget, GuiFields: field.widget.GuiFields };
				field.label = asAny(field.widget.GuiFields).label;
				fields.push(field);
				fields = fields;
				addField = false;
				console.log(fields);
			}}>Finish Widget</Button
		>
	</div>
{/if}

<style>
	.properties {
		position: fixed;
		flex-direction: column;
		display: flex;
		justify-content: center;
		align-items: center;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: #242728;
		overflow: auto;
		z-index: 111;
	}
</style>
