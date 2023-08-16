<script lang="ts">
	import axios from 'axios';
	//import sharp from 'sharp';
	//import { saveImages } from '@src/utils/utils';

	import type { FieldType } from './';
	import { entryData, mode, loadingProgress } from '@src/stores/store';
	import { getFieldName } from '@src/utils/utils';
	import { collection } from '@src/collections';
	import { FileDropzone, ProgressBar } from '@skeletonlabs/skeleton';
	import { PUBLIC_MEDIA_OUTPUT_FORMAT } from '$env/static/public';

	let _data: FileList;
	let updated = false;

	export let field: FieldType;
	export const WidgetData = async () => (updated ? _data : null);
	export let file: File | undefined = undefined; // pass file directly from imageArray

	let fieldName = getFieldName(field);
	let optimizedFileName: string | undefined = undefined;
	let optimizedFileSize: number | undefined = undefined;
	let optimizedMimeType: string | undefined = undefined;
	let hashValue: string | undefined; // Explicitly define the type

	async function setFile(event: Event) {
		const node = event.target as HTMLInputElement;

		// Reset loading progress
		loadingProgress.set(0);

		if (node.files?.length === 0) {
			//console.log('setFile:', 'No files selected');
			return;
		}

		// Handle file selection
		const handleFileSelection = async (files: FileList) => {
			//console.log('handleFileSelection:', 'Function called');

			updated = true;
			_data = files;

			// Calculate perceptual hash
			if (_data.length > 0) {
				try {
					// Use image-phash to calculate perceptual hash
					const arrayBuffer = await _data[0].arrayBuffer();
					// hashValue = await pHash(new Uint8Array(arrayBuffer));
					hashValue = 'phash not working';
				} catch (error) {
					console.error('handleFileSelection:', 'Error calculating hash:', error);
				}
			}

			// All files processed, set loading progress to 100%
			loadingProgress.set(100);
		};

		// Check if the input has files selected
		if (node.files) {
			handleFileSelection(node.files);
		} else if (file instanceof File) {
			const fileList = new DataTransfer();
			fileList.items.add(file);
			handleFileSelection(fileList.files);

			//TODO: Image Preview not working for edit anymore
		} else if ($mode === 'edit') {
			axios.get($entryData[fieldName].thumbnail.url, { responseType: 'blob' }).then(({ data }) => {
				const fileList = new DataTransfer();
				const file = new File([data], $entryData[fieldName].name, {
					type: $entryData[fieldName].mimetype
				});
				fileList.items.add(file);
				handleFileSelection(fileList.files);
			});
		}

		// All files processed, set loading progress to 100%
		loadingProgress.set(100);
	}
</script>

<FileDropzone
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
</FileDropzone>

<!-- Image preview --><!-- Image preview -->
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
			<p>Hash: <span class="text-error-500">{hashValue}</span></p>

			<br />

			<!-- Display loading progress -->
			{#if $loadingProgress != 100}
				<p class="text-lg font-semibold text-primary-500">
					Optimized as <span class="uppercase">{PUBLIC_MEDIA_OUTPUT_FORMAT}: </span>
				</p>
				<ProgressBar
					label="Image Optimization"
					value={$loadingProgress}
					max={100}
					meter="bg-surface-900-50-token"
				/>
				<!-- Display optimized image information -->

				<p class="text-lg font-semibold text-primary-500">
					Optimized as <span class="uppercase">{PUBLIC_MEDIA_OUTPUT_FORMAT}: </span>
				</p>
				<!-- Display optimized status once the WebP/AVIF file is generated -->
				<p>Uploaded File: <span class="text-primary-500">{optimizedFileName}</span></p>
				<p>File size: <span class="text-error-500">{(_data[0].size / 1024).toFixed(2)} KB</span></p>

				<p>MIME type: <span class="text-error-500">{optimizedMimeType}</span></p>
			{:else if optimizedFileName}
				<!-- only load once optimizsed -->
				<p class="text-lg font-semibold text-primary-500">
					Optimized as <span class="uppercase">{PUBLIC_MEDIA_OUTPUT_FORMAT}: </span>
				</p>
				<!-- Display optimized status once the WebP/AVIF file is generated -->
				<p>Uploaded File: <span class="text-primary-500">{optimizedFileName}</span></p>
				<p>File size: <span class="text-error-500">{(_data[0].size / 1024).toFixed(2)} KB</span></p>

				<p>MIME type: <span class="text-error-500">{optimizedMimeType}</span></p>
			{/if}
		</div>
	</div>
{/if}
