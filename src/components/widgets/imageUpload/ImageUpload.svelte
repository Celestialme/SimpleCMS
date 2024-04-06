<script lang="ts">
	import axios from 'axios';
	import type { FieldType } from './';
	import { entryData, mode } from '@src/stores/store';
	import { getFieldName } from '@src/utils/utils';
	export let field: FieldType;
	let _data: File;
	let updated = false;
	export const WidgetData = async () => {
		if (_data) {
			_data.path = field.path;
			let arrayBuffer = await _data.arrayBuffer();
			_data.buffer = new Uint8Array(arrayBuffer);
		}
		return updated ? _data : null;
	};
	export let value: File | { [key: string]: any } = $entryData[getFieldName(field)]; // pass file directly from imageArray
	console.log(value);
	let fieldName = getFieldName(field);
	function setFile(node: HTMLInputElement) {
		node.onchange = (e) => {
			if ((e.target as HTMLInputElement).files?.length == 0) return;
			updated = true;
			_data = (e.target as HTMLInputElement).files?.[0] as File;
		};

		if (value instanceof File) {
			let fileList = new DataTransfer();
			fileList.items.add(value);
			node.files = fileList.files;
			_data = node.files[0];
			updated = true;
		} else if ($mode === 'edit' && value?.thumbnail) {
			axios.get(value.thumbnail.url, { responseType: 'blob' }).then(({ data }) => {
				if (value instanceof File) return;
				let fileList = new DataTransfer();
				let file = new File([data], value.thumbnail.name, {
					type: value.mimetype
				});
				fileList.items.add(file);
				node.files = fileList.files;
				_data = node.files[0];
			});
		}
	}
</script>

<input
	use:setFile
	name={fieldName}
	class="w-full cursor-pointer rounded-lg border border-surface-300 bg-surface-50 text-sm text-surface-900 focus:outline-none dark:border-surface-600 dark:bg-surface-700 dark:text-surface-400 dark:placeholder-surface-400"
	type="file"
/>
<!-- TODO: Add DropZone for better User experiance-->
<!-- <FileDropzone /> -->

{#if _data}
	<img src={URL.createObjectURL(_data)} alt="" />
{/if}

<style>
	img {
		max-width: 600px;
		max-height: 200px;
		margin: auto;
		margin-top: 10px;
	}
</style>
