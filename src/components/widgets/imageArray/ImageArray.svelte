<script lang="ts">
	import Fields from '@src/components/Fields.svelte';
	import { mode } from '@src/stores/store';
	import { saveFormData } from '@src/utils/utils';

	export let field: any;
	let _fieldsValue: any = [];
	let files: any = [];
	export const WidgetData = async () => {
		console.log(files.length);
		for (let i = 0; i < files.length; i++) {
			let fieldsData = _fieldsValue[i];
			console.log(fieldsData);
			debugger;
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
			<Fields root={false} fields={field.fields} bind:fieldsData={_fieldsValue[index]} {file} />
		</div>
	{/each}
{:else if $mode == 'edit'}
	<Fields fields={field.fields} />
{:else}
	<input
		bind:files
		name={field.db_fieldName}
		multiple
		class="block w-full cursor-pointer rounded-lg border border-surface-300 bg-surface-50 text-sm text-surface-900 focus:outline-none dark:border-surface-600 dark:bg-surface-700 dark:text-surface-400 dark:placeholder-surface-400"
		type="file"
	/>
{/if}

<style>
</style>
