<script lang="ts">
	import type { FieldType } from '.';
	import {
		collections,
		collection,
		entryData,
		mode,
		contentLanguage,
		saveFunction
	} from '@src/stores/store.svelte';

	import { findById } from '@src/utils/utils';
	import { saveFormData } from '@src/utils/data';
	import DropDown from './DropDown.svelte';
	import Fields from '@src/components/Fields.svelte';
	import { getData } from '@src/utils/data';
	import { getFieldName, extractData } from '@src/utils/fields';

	export let field: FieldType;
	let fieldName = getFieldName(field);
	export let value = entryData()[fieldName];
	export let expanded = false;

	let dropDownData;
	let selected: { display: any; _id: any } | undefined = undefined;
	let fieldsData = {};
	let showDropDown = false;
	let entryMode: 'create' | 'edit' | 'choose' = 'choose';
	let relation_entry;
	let relationCollection = collections()[field?.relation];

	export const WidgetData = async () => {
		debugger;
		let relation_id = '';
		if (!field) return;
		if (entryMode == 'create') {
			relation_id = (
				await saveFormData({ data: fieldsData, _collection: relationCollection, _mode: 'create' })
			)[0]?._id;
		} else if (entryMode == 'choose') {
			relation_id = selected?._id;
		}
		return relation_id;
	};
	async function openDropDown() {
		if (!field) return;
		dropDownData = (
			await getData({
				collectionName: field.relation as any,
				limit: 10
			})
		).entryList;

		showDropDown = true;
		entryMode = 'choose';
	}
	let display = '';

	$: (async (_) => {
		let data;
		if (mode() == 'edit' && field) {
			if (entryMode == 'edit' || entryMode == 'create') {
				data = await extractData(fieldsData);
			} else if (entryMode == 'choose') {
				if (typeof value == 'string') {
					data = await findById(value, relationCollection?.id as string);
				} else {
					data = value;
				}
			}
			!relation_entry && (relation_entry = data);
		} else {
			data = await extractData(fieldsData);
		}

		data = data[field.displayPath] ? data : value;
		data = mode() == 'create' ? {} : data;
		!display &&
			(display = await field?.display({
				data,
				field,
				collection: collection(),
				entry: entryData(),
				contentLanguage: contentLanguage()
			}));
	})(expanded);

	async function save() {
		let data = await saveFormData({
			data: fieldsData,
			_collection: relationCollection,
			_mode: 'edit',
			id: relation_entry._id
		});
		console.log(data);
		display = await field?.display({
			data,
			field,
			collection: collection(),
			entry: entryData(),
			contentLanguage: contentLanguage()
		});
		expanded = false;
		saveFunction().reset();
	}
</script>

{#if !expanded && !showDropDown}
	<div class="flex header">
		<p class="flex-grow text-center" on:click={openDropDown}>
			{@html selected?.display || display || 'select new'}
		</p>
		<div class="ml-auto">
			{#if mode() == 'create'}
				<button
					on:click={() => {
						expanded = !expanded;
						entryMode = 'create';
						fieldsData = {};
						selected = undefined;
						relation_entry = {};
					}}
					class="btn mr-1"
					><iconify-icon icon="uil:focus-add" width="24" height="24" />
				</button>
			{:else}
				<button
					on:click={() => {
						expanded = !expanded;
						entryMode = 'edit';
						fieldsData = {};
						selected = undefined;
					}}
					class="btn"><iconify-icon icon="raphael:edit" width="24" height="24" /></button
				>
			{/if}
		</div>
	</div>
{:else if !expanded && showDropDown}
	<DropDown {dropDownData} {field} bind:selected bind:showDropDown />
{:else}
	<Fields
		fields={relationCollection?.fields}
		root={false}
		bind:fieldsData
		customData={relation_entry}
	/>
	{((saveFunction().fn = save), '')}
{/if}

<style>
	.header {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 2px;
		border: 1px solid #80808045;
		border-radius: 5px;
		padding: 10px 0px;
		padding-left: 50px;
		padding-right: 10px;
		margin-bottom: 5px;
		max-width: 100%;
		width: 100vw;
		min-width: 200px;
		cursor: pointer;
	}
	button:active {
		transform: scale(0.9);
	}
</style>
