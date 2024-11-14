<script lang="ts">
	import Fields from '@src/components/Fields.svelte';
	import { mode } from '@src/stores/store.svelte';
	import { saveFormData } from '@src/utils/data';
	import type { FieldType } from '.';
	import { getFieldName } from '@src/utils/fields';

	interface Props {
		field: FieldType;
		WidgetData?: any;
	}

	let { field, WidgetData = $bindable() }: Props = $props();
	let _fieldsValue: any = $state([]);
	let files: any = $state([]);
	WidgetData = async () => {
		for (let i = 0; i < files.length; i++) {
			let fieldsData = _fieldsValue[i];
			for (let key in fieldsData) {
				console.log(await fieldsData[key]());
			}
			await saveFormData({ data: fieldsData });
		}
		if (!files.length) {
			// if no files currently being chosen, means we are editing, should update.
			let fieldsData = _fieldsValue;
			await saveFormData({ data: fieldsData });
		}
	};
</script>

{#if files.length > 0}
	{#each files as file, index}
		<div class="relative my-4 rounded-lg border-2 border-[#8cccff] p-[20px]">
			<Fields
				root={false}
				fields={field.fields}
				bind:fieldsData={_fieldsValue[index]}
				value={file}
			/>
		</div>
	{/each}
{:else if mode() == 'edit'}
	<Fields fields={field.fields} />
{:else}
	<input
		bind:files
		name={getFieldName(field)}
		multiple
		class="block w-full cursor-pointer rounded-lg border border-[#b1b3c5] bg-[#e2e3e9] text-sm text-[#1d2036] focus:outline-none dark:border-[#353b63] dark:bg-[#2c3253] dark:text-[#767b9a] dark:placeholder-[#767b9a]"
		type="file"
	/>
{/if}
