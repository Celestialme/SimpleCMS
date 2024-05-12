<script lang="ts">
	import type { ImageFiles } from '@src/utils/types';
	import { SIZES, debounce } from '@src/utils/utils';
	import axios from 'axios';
	export let onselect: any = () => {};
	let files: ImageFiles[] = [];
	let search = '';
	let currentPage = 1;
	let pagesCount = 1;
	async function refresh() {
		let resp = await axios.get(`/media/getAll?page=${currentPage}&search=${search}`);
		files = resp.data.images;
		pagesCount = resp.data.pagesCount;
	}
	refresh();
	let searchDeb = debounce(500);
	$: {
		searchDeb(() => refresh());
		search;
		currentPage;
	}
	function formatBytes(bytes) {
		if (bytes >= 1073741824) {
			return (bytes / 1073741824).toFixed(2) + ' GB';
		} else if (bytes >= 1048576) {
			return (bytes / 1048576).toFixed(2) + ' MB';
		} else if (bytes >= 1024) {
			return (bytes / 1024).toFixed(2) + ' KB';
		} else {
			return bytes + ' bytes';
		}
	}
	let showInfo = Array.from({ length: files.length }, () => false);
</script>

<div class="header">
	<p class="text-white text-lg">Media</p>
	<input type="text" bind:value={search} placeholder="Search" />
</div>
<div
	class="flex flex-wrap items-center overflow-auto max-h-[calc(100%-55px)] justify-center w-screen max-w-full"
>
	{#each files as file, index}
		<div on:click={() => onselect(file)} class="card relative flex flex-col md:w-[30%] w-[100%]">
			<div class="absolute flex w-full bg-[#2c3844] items-center">
				<button
					class="mt-[2px] ml-[2px] w-[30px] block"
					on:click|stopPropagation={() => (showInfo[index] = !showInfo[index])}
				>
					<iconify-icon icon="raphael:info" width="25" class="text-[#00d3d0]"></iconify-icon>
				</button>
				<p class="mx-auto text-white pr-[30px]">{file.thumbnail.name}</p>
				{#if file.used_by.length == 0}
					<button
						class="mt-[2px] mr-[2px] w-[30px] block"
						on:click|stopPropagation={async () => {
							let data = new FormData();
							data.append('id', file._id);
							await axios.post('/media/delete', data);
							await refresh();
						}}
					>
						<iconify-icon icon="pajamas:remove-all" width="22" class="text-[red]"></iconify-icon>
					</button>
				{/if}
			</div>
			<img
				class:hidden={showInfo[index]}
				src={file.thumbnail.url}
				class="mt-auto max-h-[calc(100%-35px)] mx-auto rounded-md"
			/>

			<div class:hidden={!showInfo[index]}>
				<p class=" mt-[30px] text-white text-center bg-[#2c3844]">
					{file.used_by.length == 0
						? 'Not Used'
						: file.used_by.length == 1
							? 'Used By 1 entry'
							: `Used By ${file.used_by.length} entries`}
				</p>
				<table class="w-full min-h-[calc(100%-30px)]">
					<tbody>
						{#each Object.keys(SIZES) as size}
							<tr>
								<td class="!pl-[10px]">
									{size}
								</td>
								<td>
									{file[size].width}x{file[size].height}
								</td>
								<td>
									{formatBytes(file[size].size)}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/each}
</div>
<div class="pages">
	{#each Array((pagesCount || 0) > 1 ? pagesCount : 0) as _, page}
		<div class="page" on:click={() => (currentPage = page + 1)} class:active={page == page + 1}>
			{page + 1}
		</div>
	{/each}
</div>

<style>
	.card {
		height: 250px;
		margin: 10px;
		border-radius: 10px;
		overflow: hidden;
		box-shadow: 5px 4px 15px rgb(0 0 0 / 62%);
		cursor: pointer;
		overflow: auto;
	}
	.card::-webkit-scrollbar-thumb {
		border-radius: 50px;
		background-color: #0eb4c4;
	}
	.card::-webkit-scrollbar {
		width: 10px;
	}
	td {
		padding: 10px;
	}
	tbody {
		background-color: #202832;
		color: white;
	}
	tbody tr:nth-child(2n + 1) {
		padding: 5px 0;
		background-color: #2c3844;
	}
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
		margin-top: 20px;
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
</style>
