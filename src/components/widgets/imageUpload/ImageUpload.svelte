<script lang="ts">
	import axios from 'axios';
	import type { FieldType } from './';
	import { entryData, mode } from '@src/stores/store';
	import { asAny, getFieldName } from '@src/utils/utils';
	import Button from '@src/components/system/buttons/Button.svelte';
	export let field: FieldType;
	let _data: File | undefined;
	let updated = false;
	let input: HTMLInputElement;
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

<input use:setFile bind:this={input} name={fieldName} type="file" hidden />

<!-- TODO: Add DropZone for better User experiance-->
<!-- <FileDropzone /> -->

{#if _data}
	<div class="flex flex-col border-dashed border-2 w-[500px] max-w-full border-gray-300 pb-4">
		<div class="w-full h-[50px] bg-[#242734] flex items-center">
			<iconify-icon
				on:click={() => (_data = undefined)}
				class="ml-auto px-2 cursor-pointer text-white"
				icon="streamline:arrow-reload-horizontal-1-solid"
				width="24"
			/>
		</div>
		<img src={URL.createObjectURL(_data)} alt="" />
	</div>
{:else}
	<div
		on:drop|preventDefault={(e) => {
			updated = true;
			_data = e?.dataTransfer?.files[0];
		}}
		on:dragover|preventDefault={(e) => {
			asAny(e.target).style.borderColor = '#6bdfff';
		}}
		on:dragleave|preventDefault={(e) => {
			asAny(e.target).style.removeProperty('border-color');
		}}
		class="w-[500px] max-w-full h-[200px] mt-2 border-2 border-dashed border-[#c1c1c1] flex flex-col items-center justify-center gap-4 select-none"
	>
		<p>Drag & Drop</p>
		<p>or</p>
		<Button on:click={() => input.click()}>Browse</Button>
	</div>
{/if}

<style>
	img {
		max-width: 600px;
		max-height: 200px;
		margin: auto;
		margin-top: 10px;
	}
</style>
