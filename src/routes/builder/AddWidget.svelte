<script lang="ts">
	import DropDown from '@src/components/system/dropDown/DropDown.svelte';
	import widgets, { widgetKeys, type GuiSchema } from '@src/components/widgets';
	import InputSwitch from './InputSwitch.svelte';
	import Button from '@src/components/system/buttons/Button.svelte';
	import { deepCopy } from '@src/utils/utils';
	import XIcon from '@src/components/system/icons/XIcon.svelte';

	let guiSchema: GuiSchema = $state() as any;
	interface Props {
		fields?: Array<any>;
		addField?: Boolean;
		editField?: Boolean;
		selected_widget?: typeof widgetKeys | null;
		field?: {
			label: '';
			widget: typeof widgetKeys;
			params: {};
		};
	}

	let {
		fields = $bindable([]),
		addField = $bindable(false),
		editField = false,
		selected_widget = $bindable(),
		field = $bindable()
	}: Props = $props();
	let saveField = deepCopy(field);
	field = field || {
		label: '',
		widget: selected_widget as any,
		params: {}
	};
	let tabs = {
		Core(property: string) {
			return ['label', 'display', 'db_fieldName'].includes(property);
		},

		Specific(property: string) {
			return !this.Core(property);
		}
	};
	let currentTab: keyof typeof tabs = $state('Core');
	$effect(() => {
		if (selected_widget) {
			guiSchema = widgets[selected_widget].GuiSchema;
		}
	});
</script>

{#if !selected_widget && !editField}
	<div class="properties">
		<button class="ml-auto mr-[40px] mb-[20px]" onclick={() => (addField = false)}><XIcon /></button
		>
		<DropDown items={widgetKeys} bind:selected={selected_widget} label="Select Widget" />
	</div>
{:else}
	<div class="properties">
		<button
			class="ml-auto mr-[40px]"
			onclick={() => {
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
				{#if guiSchema && Object.keys(guiSchema).some((key) => tabs[tab](key))}
					<Button
						class="!min-w-[120px]"
						bgColor={tab == currentTab ? '#42c542' : 'gray'}
						onclick={() => (currentTab = tab as any)}>{tab}</Button
					>
				{/if}
			{/each}
		</div>
		<div class="min-h-[200px] w-full p-[10px] flex flex-col items-center">
			{#if guiSchema}
				{#each Object.entries(guiSchema) as [property, value]}
					{#if tabs[currentTab](property)}
						<InputSwitch
							bind:value={field.params[property]}
							widget={value.widget as any}
							key={property}
						/>
					{/if}
				{/each}
			{/if}
		</div>
		<Button
			onclick={() => {
				if (!selected_widget) return;
				field.label = (field.params as any).label;
				!editField && fields.push(field);
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
