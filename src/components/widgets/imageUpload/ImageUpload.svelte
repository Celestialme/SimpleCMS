<script lang="ts">
	import axios from 'axios';
	import type { FieldType } from '.';
	import { entryData, mode } from '@src/stores/store';
	import { getFieldName } from '@src/utils/utils';

	import { FileDropzone } from '@skeletonlabs/skeleton';

	export let field: FieldType | undefined;
	let _data: FileList;

	export const WidgetData = async () => _data;
	export const file: File | undefined = undefined; // pass file directly from imageArray
	let value: any;
	//console.log(file);

	let fieldName = getFieldName(field);
	let sanitizedFileName: string | undefined = undefined;

	function setFile(e: Event) {
		const node = e.target as HTMLInputElement;
		const files = node.files as FileList;

		if (files && files[0]) {
			const file = files[0];
			sanitizedFileName = file.name.replace(/[^a-zA-Z0-9_.]/g, '');
			const sanitizedFile = new File([file], sanitizedFileName, { type: file.type });

			let fileList = new DataTransfer();
			fileList.items.add(sanitizedFile);
			_data = fileList.files;
		}

		if (file instanceof File) {
			let fileList = new DataTransfer();
			fileList.items.add(file);
			_data = node.files = fileList.files;
		} else if ($mode === 'edit') {
			axios.get(`/${field?.path}/${$entryData[fieldName].name}`, { responseType: 'blob' }).then(({ data }) => {
				let fileList = new DataTransfer();
				let file = new File([data], $entryData[fieldName].name, {
					type: $entryData[fieldName].mimetype
				});
				fileList.items.add(file);
				_data = node.files = fileList.files;
			});
		}
	}
</script>

<!-- <FileDropzone /> -->
<FileDropzone name={fieldName} accept="image/*" on:change={setFile}>
	<svelte:fragment slot="lead"><iconify-icon icon="fa6-solid:file-arrow-up" width="45" /></svelte:fragment>
	<svelte:fragment slot="message"><span class="font-bold">Upload a file</span> or drag & drop</svelte:fragment>
	<svelte:fragment slot="meta">PNG, JPG, and GIF allowed.</svelte:fragment>
</FileDropzone>

<!-- image preview -->
<!-- TODO: add further EXIF data for better media gallery search. -->
{#if _data && $mode === 'create'}
	<div class="flex flex-col items-center md:flex-row">
		<div class="flex justify-center md:mr-4">
			<img src={URL.createObjectURL(_data[0])} alt="" class="mt-4 h-60 rounded-md border" />
		</div>
		<div class="mt-2 text-center md:text-left">
			<p class="text-lg font-semibold text-primary-500">Uploaded File:</p>
			<p>Uploaded File: <span class="text-primary-500">{_data[0].name}</span></p>
			<p>File size: <span class="text-primary-500">{(_data[0].size / 1024).toFixed(2)} KB</span></p>
			<p>MIME type: <span class="text-primary-500">{_data[0].type}</span></p>
			<p>LastModified: <span class="text-primary-500">{_data[0].lastModifiedDate}</span></p>

			<br />

			<!-- TODO image save as optimizes avif with sanitizedFileName -->
			<p class="text-lg font-semibold text-primary-500">Optimized as AVIF:</p>

			<p>Uploaded File: <span class="text-primary-500">{sanitizedFileName}</span></p>
			<p>File size: <span class="text-error-500">{(_data[0].size / 1024).toFixed(2)} KB</span></p>
			<p>MIME type: <span class="text-error-500">image/avif</span></p>
		</div>
	</div>
{/if}

<!-- TODO: way is image not loading on edit? -->
{#if _data && $mode === 'edit'}
	<img src={URL.createObjectURL(_data[0])} alt="" />
{/if}
