<script lang="ts">
	import type { FieldType } from '.';
	import { entryData, mode } from '@src/stores/store';
	import { contentLanguage } from '@src/stores/load';
	import { extractData, find, findById, getFieldName, saveFormData } from '@src/utils/utils';
	import DropDown from './DropDown.svelte';
	import Fields from '@src/components/Fields.svelte';
	import Button from '@src/components/system/buttons/Button.svelte';
	import Icon from '@iconify/svelte';
	import { collection } from '@src/collections';
	export let field: FieldType | undefined;
	let fieldName = getFieldName(field);
	export let value = $entryData[fieldName];
	export let expanded = false;

	let dropDownData;
	let selected: { display: any; _id: any } | undefined = undefined;
	let fieldsData = {};
	let showDropDown = false;
	let entryMode: 'create' | 'edit' | 'choose' = 'choose';
	let relation_entry;
	export const WidgetData = async () => {
		let relation_id = '';
		if (!field) return;
		if (entryMode == 'create') {
			relation_id = (await saveFormData({ data: fieldsData, _collection: field.relation, _mode: 'create' }))[0]?._id;
			console.log(relation_id);
		} else if (entryMode == 'choose') {
			relation_id = selected?._id;
		} else if (entryMode == 'edit') {
			relation_id = (await saveFormData({ data: fieldsData, _collection: field.relation, _mode: 'edit', id: relation_entry._id }))[0]?._id;
		}
		return relation_id;
	};
	async function openDropDown() {
		if (!field) return;
		dropDownData = await find({}, field.relation);
		showDropDown = true;
		entryMode = 'choose';
	}
	let display = '';

	$: (async (_) => {
		let data;
		if ($mode == 'edit' && field) {
			if (entryMode == 'edit' || entryMode == 'create') {
				data = await extractData(fieldsData);
			} else if (entryMode == 'choose') {
				data = await findById($entryData[getFieldName(field)], field.relation);
			}
			!relation_entry && (relation_entry = data);
		} else {
			data = await extractData(fieldsData);
		}
		display = await field?.display({ data, field, collection: $collection ?? {}, entry: $entryData, contentLanguage: $contentLanguage });
	})(expanded);
</script>

{#if !expanded && !showDropDown}
	<div class="flex">
		<p on:click={openDropDown}>{selected?.display || display || 'select new'}</p>
		<button
			on:click={() => {
				expanded = !expanded;
				entryMode = 'edit';
				fieldsData = {};
				selected = undefined;
			}}
			class="btn"><Icon icon="bi:pencil-fill" width="22" /></button
		>
		<button
			on:click={() => {
				expanded = !expanded;
				entryMode = 'create';
				fieldsData = {};
				selected = undefined;
			}}
			class="btn mr-1"
			><Icon icon="ic:baseline-plus" width="22" />
		</button>
	</div>
{:else if !expanded && showDropDown}
	<DropDown {dropDownData} {field} bind:selected bind:showDropDown />
{:else}
	<Fields fields={field?.relation.fields} root={false} bind:fieldsData customData={relation_entry} />
	<Button on:click={() => (expanded = false)}>Save</Button>
{/if}
