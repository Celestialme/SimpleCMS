<script lang="ts">
	import DropDown from '@src/components/system/dropDown/DropDown.svelte';
	import widgets from '@src/components/widgets';
	import InputSwitch from './InputSwitch.svelte';
	import Button from '@src/components/system/buttons/Button.svelte';
	import { asAny } from '@src/utils/utils';
	import XIcon from '@src/components/system/icons/XIcon.svelte';
	export let fields: Array<any> = [];
	export let addField: Boolean = false;
	export let editField: Boolean = false;
	export let selected_widget: keyof typeof widgets | null = null;
	let widget_keys = Object.keys(widgets) as unknown as keyof typeof widgets;

	let guiSchema: (typeof widgets)[typeof widget_keys]['GuiSchema'];
	$: if (selected_widget) {
		guiSchema = widgets[selected_widget].GuiSchema;
	}
	export let field = { label: '', widget: { key: selected_widget as unknown as keyof typeof widgets, GuiFields: {} } };
	let saveField = structuredClone(field);

	let tabs = {
		Core(property: string) {
			return ['label', 'display', 'db_fieldName'].includes(property);
		},
		Permissions(property: string) {
			return ['permissions'].includes(property);
		},
		Specific(property: string) {
			return !this.Core(property) && !this.Permissions(property);
		}
	};
	let currentTab: keyof typeof tabs = 'Core';
</script>

{#if !selected_widget && !editField}
	<div class="properties">
		<button class="ml-auto mr-[40px] mb-[20px]" on:click={() => (addField = false)}><XIcon /></button>
		<DropDown items={widget_keys} bind:selected={selected_widget} label="Select Widget" />
	</div>
{:else}
	<div class="properties">
		<button
			class="ml-auto mr-[40px]"
			on:click={() => {
				if (editField) {
					for (let key in field) {
						field[key] = saveField[key];
					}
					addField = false;
				} else {
					selected_widget = null;
				}
			}}><XIcon /></button
		>
		<div class="flex justify-center gap-1 w-full">
			{#each Object.keys(tabs) as tab}
				<Button on:click={() => (currentTab = asAny(tab))}>{tab}</Button>
			{/each}
		</div>
		<div class="min-h-[200px] w-full p-[10px] flex flex-col items-center">
			{#each Object.entries(guiSchema) as [property, value]}
				{#if tabs[currentTab](property)}
					<InputSwitch bind:value={field.widget.GuiFields[property]} widget={asAny(value).widget} key={property} />
				{/if}
			{/each}
		</div>
		<Button
			on:click={() => {
				if (!selected_widget) return;
				field.widget = { key: selected_widget, GuiFields: field.widget.GuiFields };
				field.label = asAny(field.widget.GuiFields).label;
				!editField && fields.push(field);
				fields = fields;
				addField = false;
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
