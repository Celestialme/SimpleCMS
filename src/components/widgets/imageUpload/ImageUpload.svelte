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
	//console.log(file);

	let fieldName = getFieldName(field);

	// TODO: Save ad Webp only with all
	async function onChangeHandler(e: Event): void {
		_data = (e.target as HTMLInputElement).files as FileList;
		const file = _data[0];
		const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9_.]/g, '');
		const formData = new FormData();
		formData.append('file', file, sanitizedFileName);
		try {
			await axios.post('/api/media', formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			});
			console.log('File uploaded successfully');
		} catch (error) {
			console.error('Error uploading file:', error);
		}
	}
</script>

<!-- <FileDropzone /> -->
<FileDropzone name={fieldName} accept="image/*" on:change={onChangeHandler}>
	<svelte:fragment slot="lead"><iconify-icon icon="fa6-solid:file-arrow-up" width="45" /></svelte:fragment>
	<svelte:fragment slot="message"><span class="font-bold">Upload a file</span> or drag & drop</svelte:fragment>
	<svelte:fragment slot="meta">PNG, JPG, and GIF allowed.</svelte:fragment>
</FileDropzone>

<!-- image preview -->
<!-- TODO: add futher EXIF data for better media gallery search. -->
{#if _data}
	<div class="flex flex-col items-center md:flex-row">
		<div class="flex justify-center md:mr-4">
			<img src={URL.createObjectURL(_data[0])} alt="" class="mt-4 h-60 rounded-md border" />
		</div>
		<div class="mt-2 text-center md:text-left">
			<p>File name: <span class="text-primary-500">{_data[0].name}</span></p>
			<p>File size: <span class="text-primary-500">{(_data[0].size / 1024).toFixed(2)} KB</span></p>
			<p>MIME type: <span class="text-primary-500">{_data[0].type}</span></p>
		</div>
	</div>
{/if}
