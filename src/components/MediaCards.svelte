<script>
	import { SIZES } from '@src/utils/utils';
	import axios from 'axios';

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
	export let files;
	export let onselect;

	let showInfo = Array.from({ length: files.length }, () => false);
</script>

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
						await axios.post('/storage/delete', data);
						files = files.filter((f) => f._id != file._id);
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

<style>
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
</style>
