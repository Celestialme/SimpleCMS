<script lang="ts">
	import axios from 'axios';
	import type { FieldType } from './';
	import { entryData, mode, loadingProgress } from '@src/stores/store';
	import { getFieldName } from '@src/utils/utils';
	import { collection } from '@src/collections';
	import { FileDropzone } from '@skeletonlabs/skeleton';

	let _data: FileList;
	let updated = false;

	export let field: FieldType;
	export const WidgetData = async () => (updated ? _data : null);
	export let file: File | undefined = undefined; // pass file directly from imageArray
	console.log(file);

	let fieldName = getFieldName(field);
	let sanitizedFileName: string | undefined = undefined;

	function setFile(node: HTMLInputElement) {
		// Reset loading progress
		loadingProgress.set(0);

		node.onchange = (e) => {
			if ((e.target as HTMLInputElement).files?.length == 0) return;
			updated = true;
			_data = (e.target as HTMLInputElement).files as FileList;
		};

		if (file instanceof File) {
			let fileList = new DataTransfer();
			fileList.items.add(file);
			_data = node.files = fileList.files;
		} else if ($mode === 'edit') {
			axios.get($entryData[fieldName].thumbnail.url, { responseType: 'blob' }).then(({ data }) => {
				let fileList = new DataTransfer();
				let file = new File([data], $entryData[fieldName].name, {
					type: $entryData[fieldName].mimetype
				});
				fileList.items.add(file);
				_data = node.files = fileList.files;
			});
		}
		// All files processed, set loading progress to 100%
		loadingProgress.set(100);
	}
</script>

<input
	use:setFile
	name={fieldName}
	class="w-full cursor-pointer rounded-lg border border-surface-300 bg-surface-50 text-sm text-surface-900 focus:outline-none dark:border-surface-600 dark:bg-surface-700 dark:text-surface-400 dark:placeholder-surface-400"
	type="file"
/>

<!-- TODO: Add skeleton DropZone for better User experience-->
<!-- <FileDropzone /> -->

<!-- <FileDropzone
	name={fieldName}
	accept="image/*,image/webp,image/avif,image/svg+xml"
	on:change={setFile}
>
	<svelte:fragment slot="lead"
		><iconify-icon icon="fa6-solid:file-arrow-up" width="45" /></svelte:fragment
	>
	<svelte:fragment slot="message"
		><span class="font-bold">Upload a file</span> or drag & drop</svelte:fragment
	>
	<svelte:fragment slot="meta">PNG, JPG, GIF, WEBP, AVIF, and SVG allowed.</svelte:fragment>
</FileDropzone> -->

<!-- Display loading progress -->
{#if $loadingProgress !== 100}
	<p>Loading Progress: {$loadingProgress}%</p>
{/if}

<!-- Image preview -->
<!-- TODO: add further EXIF data for better media gallery search. -->
{#if _data}
	<div class="flex flex-col items-center md:flex-row">
		<div class="flex justify-center md:mr-4">
			<img src={URL.createObjectURL(_data[0])} alt="" class="mt-4 h-60 rounded-md border" />
		</div>
		<div class="mt-2 text-center md:text-left">
			<p class="text-lg font-semibold text-primary-500">Uploaded File:</p>
			<p>Uploaded File: <span class="text-primary-500">{_data[0].name}</span></p>
			<p>File size: <span class="text-primary-500">{(_data[0].size / 1024).toFixed(2)} KB</span></p>
			<p>MIME type: <span class="text-primary-500">{_data[0].type}</span></p>

			<br />

			<!-- TODO image save as optimizes avif with sanitizedFileName -->
			<p class="text-lg font-semibold text-primary-500">Optimized as AVIF:</p>

			<p>Uploaded File: <span class="text-primary-500">{sanitizedFileName}</span></p>
			<p>File size: <span class="text-error-500">{(_data[0].size / 1024).toFixed(2)} KB</span></p>
			<p>MIME type: <span class="text-error-500">image/avif</span></p>
		</div>
	</div>
{/if}
