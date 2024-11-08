<script lang="ts">
	import Fields from '@src/components/Fields.svelte';
	import { mode } from '@src/stores/store.svelte';
	import { getFieldName, saveFormData } from '@src/utils/utils';
	import type { FieldType } from '.';

	export let field: FieldType;
	let _fieldsValue: any = [];
	let files: any = [];
	export const WidgetData = async () => {
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
		class="block w-full cursor-pointer rounded-lg border border-surface-300 bg-surface-50 text-sm text-surface-900 focus:outline-none dark:border-surface-600 dark:bg-surface-700 dark:text-surface-400 dark:placeholder-surface-400"
		type="file"
	/>
{/if}
