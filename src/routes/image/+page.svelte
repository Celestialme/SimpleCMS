<script lang="ts">
	import axios from 'axios';
	import { FileDropzone } from '@skeletonlabs/skeleton';

	let file;
	let previewImageUrl;
	let originalImage;
	let optimizedImage;
	let optimizedImageUrl;
	let thumbnailImage;
	let thumbnailImageUrl;
	let isLoading = false;
	let loadingTimer: any; // recommended time of around 200-300ms
	let fieldName = 'myFileInput';

	let errorMessage = '';

	//  file size using the appropriate unit (bytes, kilobytes, megabytes, or gigabytes
	function formatSize(sizeInBytes) {
		if (sizeInBytes < 1024) {
			return `${sizeInBytes} bytes`;
		} else if (sizeInBytes < 1024 * 1024) {
			return `${(sizeInBytes / 1024).toFixed(2)} KB`;
		} else if (sizeInBytes < 1024 * 1024 * 1024) {
			return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
		} else {
			return `${(sizeInBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
		}
	}

	const setFile = async (event) => {
		file = event.target.files[0];

		// Basic validation
		if (!file.type.startsWith('image/')) {
			errorMessage = 'Please select a valid image file';
			return;
		}

		// Create a local URL representing the uploaded file
		previewImageUrl = URL.createObjectURL(file);

		// Delete old images // TODO: not working yet
		if (originalImage && optimizedImage) {
			try {
				await axios.delete(`/mediafiles/${optimizedImage.name}`);
				await axios.delete(`/mediathumbnails/${thumbnailImage.name}`);
			} catch (error) {
				console.error(error);
			}
		}

		originalImage = {
			name: file.name,
			size: file.size,
			type: file.type
		};

		const formData = new FormData();
		formData.append('file', file);

		loadingTimer = setTimeout(() => {
			isLoading = true;
		}, 400);

		errorMessage = '';

		try {
			const response = await axios.post('/media', formData, {});
			const data = response.data;
			optimizedImage = data;
			optimizedImageUrl = `/mediafiles/${optimizedImage.name}`;
			thumbnailImage = data.thumbnailData;
			thumbnailImageUrl = `data:image/avif;base64,${thumbnailImage}`;
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message);
			} else {
				console.error(error);
			}
		} finally {
			clearTimeout(loadingTimer);
			isLoading = false;
		}
	};
</script>

<!-- <FileDropzone /> -->
<FileDropzone name={fieldName} accept="image/*" on:change={setFile}>
	<svelte:fragment slot="lead"><iconify-icon icon="fa6-solid:file-arrow-up" width="45" /></svelte:fragment>
	<svelte:fragment slot="message"><span class="font-bold">Upload a file</span> or drag & drop</svelte:fragment>
	<svelte:fragment slot="meta">PNG, JPG, and GIF allowed.</svelte:fragment>
</FileDropzone>

<!-- display preview image -->
<div class="flex flex-col items-center md:flex-row">
	<div class="m-2 flex justify-center md:mr-4">
		<div class="rounded-mds flex flex-col">
			{#if thumbnailImageUrl}
				<div class="text-center">Optimized</div>
				<img src={thumbnailImageUrl} alt="Optimized Preview" class="h-60 rounded-md border" />
			{:else if previewImageUrl}
				<div class="text-center">Original</div>
				<img src={previewImageUrl} alt="Original Preview" class="h-60 rounded-md border" />
			{/if}
		</div>
	</div>
	<div class="mt-2 text-center md:text-left">
		{#if originalImage}
			<h2 class="mb-1">Original Image:</h2>
			<div class="flex">
				<div class="w-36">Uploaded File:</div>
				<div class="text-primary-500">{originalImage.name}</div>
			</div>
			<div class="flex">
				<div class="w-36">File size:</div>
				<div class="text-primary-500">{formatSize(originalImage.size)}</div>
			</div>
			<div class="flex">
				<div class="w-36">MIME type:</div>
				<div class="text-primary-500">{originalImage.type}</div>
			</div>
		{/if}

		{#if optimizedImage}
			<hr class="my-2 dark:text-white" />
			<h2 class="mb-1">
				<div class="flex">
					<div class="w-36">Optimized Image:</div>
					<div class={`text-primary-500 ${((originalImage.size - optimizedImage.size) / originalImage.size) * 100 <= 0 ? 'text-error-500' : ''}`}>
						{(((originalImage.size - optimizedImage.size) / originalImage.size) * 100).toFixed(2)}%
					</div>
				</div>
			</h2>
			<div class="flex">
				<div class="w-36">Sanitized File:</div>
				<div class="text-primary-500">{optimizedImage.name}</div>
			</div>
			<div class="flex">
				<div class="w-36">File size:</div>
				<div class="text-primary-500">{formatSize(optimizedImage.size)}</div>
			</div>
			<div class="flex">
				<div class="w-36">MIME type:</div>
				<div class="text-primary-500">{optimizedImage.type}</div>
			</div>
		{:else if isLoading}
			<!-- Loading spinner -->
			<div class="flex items-center justify-center gap-2">
				<img src="/spinner.svg" alt="Loading" class="w-8 dark:rounded-full dark:bg-white" />
				<div>Loading ...</div>
			</div>
		{/if}

		<!-- Error message -->
		{#if errorMessage}
			<p class="text-error-500">{errorMessage}</p>
		{/if}
	</div>
</div>
