<script lang="ts">
	import axios from 'axios';
	import type { FieldType } from './';
	import { entryData, mode } from '@src/stores/store';
	import { getFieldName } from '@src/utils/utils';

	import { FileDropzone } from '@skeletonlabs/skeleton';

	export let field: FieldType | undefined;
	let _data: FileList;
	export const WidgetData = async () => _data;
	export let file: File | undefined = undefined; // pass file directly from imageArray
	console.log(file);

	let fieldName = getFieldName(field);

	function setFile(node: HTMLInputElement) {
		node.onchange = (e) => (_data = (e.target as HTMLInputElement).files as FileList);

		if (file instanceof File) {
			let fileList = new DataTransfer();
			fileList.items.add(file);
			_data = node.files = fileList.files;
		} else if ($mode === 'edit') {
			axios.get(`${field?.path}/${$entryData[fieldName].name}`, { responseType: 'blob' }).then(({ data }) => {
				let fileList = new DataTransfer();
				let file = new File([data], $entryData[fieldName].name, {
					type: $entryData[fieldName].mimetype
				});
				fileList.items.add(file);
				_data = node.files = fileList.files;
			});
		}
	}

	function onChangeHandler(e: Event): void {
		console.log('file data:', e);
	}
</script>

<!-- TODO: Add Image display and link File-->
<!-- <FileDropzone /> -->
<FileDropzone name={fieldName} accept="image/*" on:change={onChangeHandler}>
	<svelte:fragment slot="lead"><iconify-icon icon="fa6-solid:file-arrow-up" width="45" /></svelte:fragment>
	<svelte:fragment slot="message"><span class="font-bold">Upload a file</span> or drag & drop</svelte:fragment>
	<svelte:fragment slot="meta">PNG, JPG, and GIF allowed.</svelte:fragment>
</FileDropzone>

<input
	use:setFile
	name={fieldName}
	type="file"
	class="imput mt-2 w-full cursor-pointer rounded-lg border border-surface-300 bg-surface-50 text-sm text-surface-900 focus:outline-none dark:border-surface-600 dark:bg-surface-700 dark:text-surface-400 dark:placeholder-surface-400"
/>

{#if _data}
	<div class="mr-auto">
		<img src={URL.createObjectURL(_data[0])} alt="" class="max-h-sm mt-4 max-w-sm rounded-md border" />
	</div>
{/if}
