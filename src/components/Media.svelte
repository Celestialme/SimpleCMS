<script lang="ts">
	import MediaCards from './MediaCards.svelte';
	import type { ImageFile } from '@src/utils/types';
	import { debounce } from '@src/utils/utils';
	import axios from 'axios';
	export let onselect: any = () => {};
	let files: ImageFile[] = [];
	let pagesCount = 1;
	let search = '';
	let currentPage = 1;
	let showFolders = true;
	let folders = [];
	let currentFolder = '';
	axios.get(`/storage/getFolderContentCount`).then((res) => (folders = res.data));
	async function refresh() {
		let resp = await axios.get(
			`/storage/getAll?page=${currentPage}&folder=${currentFolder}&search=${search}`
		);
		files = resp.data.images;
		pagesCount = resp.data.pagesCount;
	}
	let searchDeb = debounce(500);
	$: {
		if (!showFolders) {
			searchDeb(() => refresh());
			search;
			currentPage;
		}
	}
</script>

<div class="header">
	<iconify-icon
		icon={showFolders ? 'fluent:folder-32-filled' : 'fluent-mdl2:navigate-back'}
		class="text-white mr-2"
		class:cursor-pointer={!showFolders}
		width="30"
		on:click={() => {
			files = [];
			showFolders = true;
			pagesCount = 0;
		}}
	></iconify-icon>
	<p class="text-white text-lg">Storage</p>
	<input type="text" bind:value={search} placeholder="Search" />
</div>
<div
	class="flex flex-wrap items-center overflow-auto max-h-[calc(100%-100px)] justify-center w-screen max-w-full"
>
	{#if showFolders}
		{#each Object.keys(folders) as folder}
			<div
				class="folder"
				on:click={async () => {
					currentFolder = folder;
					showFolders = false;
				}}
			>
				<iconify-icon icon="fluent:folder-32-filled" class="text-orange-600" width="40"
				></iconify-icon>
				<div class="flex flex-col items-center mx-auto">
					<p>{folder}</p>
					<p>Count: {folders[folder]}</p>
				</div>
			</div>
		{/each}
	{:else}
		<MediaCards bind:files {onselect} />
	{/if}
</div>
<div class="pages">
	{#each Array((pagesCount || 0) > 1 ? pagesCount : 0) as _, page}
		<div
			class="page"
			on:click={() => (currentPage = page + 1)}
			class:active={currentPage == page + 1}
		>
			{page + 1}
		</div>
	{/each}
</div>

<style>
	.header {
		width: 100%;
		height: 50px;
		background: #242734;
		display: flex;
		align-items: center;
		padding: 0 10px;
	}
	.header input {
		margin: auto;
		font-size: 18px;
		padding: 4px;
		outline: none;
		border-radius: 6px;
	}
	.page.active {
		background-color: aquamarine;
		color: white;
	}
	.pages {
		display: flex;
		justify-content: center;
		margin-top: 5px;
	}
	.page:first-of-type {
		border-top-left-radius: 8px;
		border-bottom-left-radius: 8px;
	}
	.page:last-of-type {
		border-top-right-radius: 8px;
		border-bottom-right-radius: 8px;
	}
	.page {
		border: 1px solid transparent;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 5px 15px;
		cursor: pointer;
		box-shadow: inset 0px 0px 3px 0px #808588;
	}
	.page:hover {
		background-color: aqua;
		color: white;
	}
	.folder {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 5px;
		width: 200px;
		padding: 10px 2px;
		border-radius: 5px;
		margin: 10px;
		box-shadow: 1px 4px 3px 0px #00000070;
		cursor: pointer;
	}
</style>
