<script lang="ts">
	import axios from 'axios';
	import env from '@root/env';
	import { prevFormData } from '@src/stores/store';
	import { onMount } from 'svelte';
	import DeleteIcon from './icons/DeleteIcon.svelte';
	import {
		Button,
		ChevronLeft,
		ChevronRight,
		NavHamburger,
		Pagination,
		Search,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		TableSearch,
		Tooltip
	} from 'flowbite-svelte';
	import Icon from '@iconify/svelte';
	export let showFields = false;
	export let collection: any = undefined;
	export let deleteMode = false;
	export let category = 'Some';
	let entryList: any = [];
	let deleteMap: any = {};
	let deleteAll = false;
	$: process_deleteAll(deleteAll);
	$: deleteMode = Object.values(deleteMap).includes(true);
	let refresh_deleteMap = (_: any) => {
		deleteMap = {};
	};
	$: refresh_deleteMap(collection);
	export let refresh: (collection: any) => Promise<any>;
	onMount(() => {
		refresh = async (collection: any) => {
			entryList = [];
			entryList = await axios
				.get(`${env.HOST}:${env.PORT}/api/${collection.name}`)
				.then((data) => data.data);
			deleteMap = {};
		};
	});
	$: refresh && refresh(collection);

	export async function deleteEntry() {
		deleteAll = false;
		let deleteList: Array<string> = [];
		for (let item in deleteMap) {
			deleteMap[item] && deleteList.push(entryList[item]._id);
		}
		if (deleteList.length == 0) return;
		let formData = new FormData();
		formData.append('ids', JSON.stringify(deleteList));
		await axios.delete(`${env.HOST}:${env.PORT}/api/${collection.name}`, { data: formData });
		refresh(collection);
	}
	let filter: any = '';
	let filtered_entryList = [...entryList];
	$: {
		filtered_entryList = entryList.filter((item: object) => {
			return filter ? Object.values(item).some((x) => x.toString().includes(filter)) : true;
		});
		filter;
		console.log(filter)
	}

	function process_deleteAll(deleteAll: boolean) {
		if (deleteAll) {
			for (let item in entryList) {
				deleteMap[item] = true;
			}
		} else {
			for (let item in deleteMap) {
				deleteMap[item] = false;
			}
		}
	}
	export let toggleSideBar = false;

	// Table pagination
	let helper = { start: 1, end: 10, total: 100 };
	let pages = [
		{ name: "1", href: '/' },
		{ name: "2", href: '/' },
		{ name: "3", href: '/' },
		{ name: "4", href: '/' },
		{ name: "5", href: '/' }
	];
	const previous = () => {
		alert('Previous btn clicked. Make a call to your server to fetch data.');
	};
	const next = () => {
		alert('Next btn clicked. Make a call to your server to fetch data.');
	};

	// sort and filter
	let sort = false;
	let order = false; // false = down / true = up
	function searchFilter() {
		alert('filter added soon');
	}
	function search(e:Event){
		filter = (e.target as HTMLInputElement).value

	}
</script>

<div class="relative">
	<div class="flex gap-2 mb-2 items-center">
		<NavHamburger  on:click={() => (toggleSideBar = !toggleSideBar)} btnClass = 'md:hidden mr-1'/>
		<div class="flex flex-col w-80">
			<div class="text-gray-400 text-xs  capitalize mb-2">{category}</div>
			<div
				class="text-sm md:text-xl xl:text-2xl dark:text-white font-bold uppercase flex justify-start items-center "
			>
				<span>
					<Icon icon={collection.icon} color="white" width="24" class="mr-2" /></span
				>{collection.name}
			</div>

      
		</div>

		<!-- Search box -->
		<div class="flex justify-center items-center relative w-[50%] pr-[20px]">
			<Search
				placeholder="Search {collection.name} ..."
				hoverable={true}
				on:keyup={search}
        class="p-2"
			/>
			<button type="button" on:click={searchFilter} class="outline-none absolute right-0 mr-[20px]">
				<Icon icon="bi:filter-circle" color="gray" width="22" class="block" />
			</button>
		</div>
    	<!-- create/delete -->
    <Button
			gradient
			color={deleteMode ? 'red' : 'green'}
			class="ml-auto"
			on:click={() => {
				deleteMode ? deleteEntry() : (showFields = true);
			}}
		>
			{#if deleteMode}
				<Icon icon="bi:trash3-fill" color="white" width="22" class="mr-1" /> Delete
			{:else}
				<Icon icon="ic:round-plus" color="white" width="24" class="mr-1" /> Create
			{/if}</Button
		>
		<Tooltip placement="bottom" style="light" class="z-20"
			>{deleteMode ? 'Delete ' + collection.name : 'Create New ' + collection.name}
		</Tooltip>
	</div>
	<Table hoverable={true} class="relative">
		<TableHead>
			<TableHeadCell>Index</TableHeadCell>
			{#each collection.fields as field}
				<TableHeadCell class="text-center">{field.title}</TableHeadCell>
			{/each}
			<TableHeadCell class="text-right"
				><DeleteIcon bind:checked={deleteAll} class="ml-auto mr-[25px]" /></TableHeadCell
			>
		</TableHead>
		<TableBody class="divide-y">
			{#each filtered_entryList as entry, index}
				<TableBodyRow
					on:click={() => {
						showFields = true;
						$prevFormData = entry;
					}}
				>
					<TableBodyCell>{index + 1}</TableBodyCell>

					{#each collection.fields as field}
						{#await field?.display?.(entry[field.title], field, entry)}
							<TableBodyCell class="text-center">Loading...</TableBodyCell>
						{:then display}
							{((entry.displays = {}), '')}
							<TableBodyCell class="text-center"
								>{@html (entry.displays[field.title] = display)}</TableBodyCell
							>
						{/await}
					{/each}
					<TableBodyCell>
						<DeleteIcon bind:checked={deleteMap[index]} class="ml-auto mr-[25px]" />
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
	<div class="flex items-center justify-between gap-2 mt-4">
		<div class="text-sm text-gray-700 dark:text-gray-400">
			Showing <span class="font-semibold text-gray-900 dark:text-white">{helper.start}</span> to
			<span class="font-semibold text-gray-900 dark:text-white">{helper.end}</span>
			of
			<span class="font-semibold text-gray-900 dark:text-white">{helper.total} </span> Entries
		</div>
		<Pagination {pages} on:previous={previous} on:next={next} icon class="shadow-lg">
			<svelte:fragment slot="prev">
				<span class="sr-only">Previous</span>
				<ChevronLeft class="w-5 h-5" />
			</svelte:fragment>

			<svelte:fragment slot="next">
				<span class="sr-only">Next</span>
				<ChevronRight class="w-5 h-5" />
			</svelte:fragment>
		</Pagination>
	</div>
</div>
