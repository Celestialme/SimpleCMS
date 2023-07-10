<script lang="ts">
	import axios from 'axios';
	import { FileDropzone } from '@skeletonlabs/skeleton';
	import { toggleLeftSidebar } from '@src/stores/store';

	let file: any;
	let previewImageUrl: any;
	let originalImage: any;
	let optimizedImage: any;
	let optimizedImageUrl: any;
	let thumbnailImage: any;
	let thumbnailImageUrl: any;
	let isLoading = false;
	let loadingTimer: any; // recommended time of around 200-300ms
	let fieldName = 'MyImagDropzone';
	let paramUrl = 'upload';
	let errorMessage = '';
	let overwriteConfirmed = false;

	$: if (errorMessage === 'File already exists') {
		overwriteConfirmed = confirm('A file with this name already exists. Do you want to overwrite it?');
		if (overwriteConfirmed) {
			// TODO: Add code to overwrite the existing image
		} else {
			errorMessage = '';
		}
	}

	//  file size using the appropriate unit (bytes, kilobytes, megabytes, or gigabytes
	import { formatSize } from '@src/utils/utils';

	const setFile = async (event: any) => {
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
				await axios.delete(`/mediafiles/${paramUrl}/${optimizedImage.name}`);
				await axios.delete(`/mediafiles/${paramUrl}/thumbnails/${thumbnailImage.name}`);
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
			// TODO: Add code to overwrite the existing image
			const response = await axios.post(`/mediafiles/${paramUrl}`, formData, { headers: { 'X-Overwrite': 'true' } });
			const data = response.data;

			if (data.error) {
				errorMessage = data.error;
			}
			optimizedImage = {
				name: data.name,
				size: data.size,
				type: data.type
			};
			optimizedImageUrl = `/mediafiles/${paramUrl}/${data.name}`;
			thumbnailImage = {
				name: data.name,
				size: data.size,
				type: data.type
			};
			thumbnailImageUrl = `data:image/avif;base64,${data.thumbnailData}`;
			errorMessage = '';
		} catch (error) {
			if (axios.isAxiosError(error)) {
				if (error.response?.status === 400) {
					errorMessage = error.response.data;
				} else {
					errorMessage = error.message;
				}
			} else if (error instanceof Error) {
				errorMessage = error.message;
			} else {
				errorMessage = 'An unknown error occurred';
			}
		} finally {
			clearTimeout(loadingTimer);
			isLoading = false;
		}
	};
</script>

<div class="flex flex-col gap-1">
	<div class="flex items-center">
		<!-- hamburger -->
		{#if $toggleLeftSidebar === true}
			<button type="button" on:keydown on:click={() => toggleLeftSidebar.update((value) => !value)} class="btn-icon variant-ghost-surface mt-1">
				<iconify-icon icon="mingcute:menu-fill" width="24" />
			</button>
		{/if}
		<!-- Title  with icon -->
		<h1 class="h1 mb-2 ml-2 flex items-center gap-1">
			<iconify-icon icon="bi:images" width="24" class="mr-1 text-error-500 sm:mr-2" /> Upload Tester
		</h1>
	</div>

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
	<div class="flex items-center justify-between">
		<button class="btn variant-filled-surface">Cancel</button>
		<button class="btn variant-filled-primary">Save</button>
	</div>
</div>
