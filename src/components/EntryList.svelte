<script lang="ts">
	import axios from 'axios';
	import env from '@root/env';
	import { entryData } from '@src/stores/store';
	import { onMount } from 'svelte';
	import DeleteIcon from './icons/DeleteIcon.svelte';
	import {
		Button,
		ButtonGroup,
		ChevronDown,
		ChevronLeft,
		ChevronRight,
		Dropdown,
		DropdownItem,
		DropdownDivider,
		NavHamburger,
		Pagination,
		Search,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Tooltip
	} from 'flowbite-svelte';
	import Icon from '@iconify/svelte';

	export let showFields = false;
	export let collection: any = undefined;
	export let deleteMode = false;
	export let category = 'Some';

	// define default button
	let entryButton = 'create';
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
		{ name: '1', href: '/' },
		{ name: '2', href: '/' },
		{ name: '3', href: '/' },
		{ name: '4', href: '/' },
		{ name: '5', href: '/' }
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
	function search(e: Event) {
		filter = (e.target as HTMLInputElement).value;
	}


	function unpublishEntry() {
		throw new Error('Function not implemented.');
	}


	function cloneEntry() {
		throw new Error('Function not implemented.');
	}


	function scheduleEntry() {
		throw new Error('Function not implemented.');
	}
</script>

<div class="relative">
	<div class="flex gap-2 mb-2 items-center">
		<NavHamburger on:click={() => (toggleSideBar = !toggleSideBar)} btnClass="md:hidden mr-1" />

		<div class="flex flex-col w-80">
			<div class="text-gray-400 text-xs capitalize mb-2">{category}</div>
			<div
				class="-mt-2 text-sm md:text-xl xl:text-2xl dark:text-white font-bold uppercase flex justify-start items-center "
			>
				<span> <Icon icon={collection.icon} width="24" class="mr-2" /></span>{collection.name}
			</div>
		</div>

		<!-- expanding search -->
		<!-- Search box -->
		<div class="flex justify-center items-center relative w-[50%] pr-[20px]">
			<Search
				size="md"
				placeholder="Search {collection.name} ..."
				hoverable={true}
				on:keyup={search}
				class="p-2"
			/>
			<button
				type="button"
				on:click={searchFilter}
				class="outline-none absolute right-0 mr-[20px] px-2"
			>
				<Icon icon="bi:filter-circle" color="gray" width="22" class="block" />
			</button>
		</div>

		<!-- create/delete/publish/unpublish -->
		<ButtonGroup>
			{#if entryButton == 'create'}
				<Button
					gradient
					pill
					color="lime"
					class="!p-2 w-[150px] text-xl md:ml-auto"
					on:click={() => {
						showFields = true;
					}}
				>
					<Icon icon="ic:round-plus" color="black" width="30" class="mr-1" /> Create
				</Button>
				<Tooltip placement="bottom" style="light" class="z-20"
					>{'Create ' + collection.name}
				</Tooltip>
			{:else if entryButton == 'publish'}
				<Button
					gradient
					pill
					color="blue"
					class="!p-2 w-[150px] text-xl md:ml-auto"
					on:click={() => {
						deleteEntry();
					}}
				>
					<Icon icon="bi:hand-thumbs-up-fill" color="white" width="22" class="mr-1" /> Publish
				</Button>
				<Tooltip placement="bottom" style="light" class="z-20"
					>{'Publish ' + collection.name}
				</Tooltip>
			{:else if entryButton == 'unpublish'}
				<Button
					pill
					color="yellow"
					class="!p-2 w-[150px] text-xl md:ml-auto"
					on:click={() => {
						unpublishEntry();
					}}
				>
					<Icon icon="bi:pause-circle" color="white" width="22" class="mr-1" /> Unpublish
				</Button>
				<Tooltip placement="bottom" style="light" class="z-20"
					>{'Unpublish ' + collection.name}
				</Tooltip>
			{:else if entryButton == 'schedule'}
				<Button
					gradient
					pill
					color="pink"
					class="!p-2 w-[150px] text-xl md:ml-auto"
					on:click={() => {
						scheduleEntry();
					}}
				>
					<Icon icon="bi:clock" color="white" width="22" class="mr-1" /> Schedule
				</Button>
				<Tooltip placement="bottom" style="light" class="z-20"
					>{'Schedule ' + collection.name}
				</Tooltip>
			{:else if entryButton == 'clone'}
				<Button
					pill
					color="light"
					class="!p-2 w-[150px] text-xl md:ml-auto"
					on:click={() => {
						cloneEntry();
					}}
				>
					<Icon icon="bi:clipboard-data-fill" color="white" width="22" class="mr-1" /> Clone
				</Button>
				<Tooltip placement="bottom" style="light" class="z-20"
					>{'Clone ' + collection.name}
				</Tooltip>
			{:else if entryButton == 'delete'}
				<Button
					gradient
					pill
					color="red"
					class="!p-2 w-[150px] text-xl md:ml-auto"
					on:click={() => {
						deleteEntry();
					}}
				>
					<Icon icon="bi:trash3-fill" color="white" width="22" class="mr-1" /> Delete
				</Button>
				<Tooltip placement="bottom" style="light" class="z-20"
					>{'Delete ' + collection.name}
				</Tooltip>
			{/if}

			<Button class="px-1 rounded-r-xl "><ChevronDown /></Button>
			<Dropdown>
				{#if entryButton == 'create'}
					<DropdownItem
						on:click={() => {
							entryButton = 'create';
						}}
						class="flex justify-start items-center gap-1 text-lg text-black hover:text-white -my-1 bg-lime-500 font-bold gap-1"
					>
						<Icon icon="ic:round-plus" width="22" />
						Create
					</DropdownItem>
					<DropdownDivider />
				{/if}

				{#if entryButton == 'publish'}
					<DropdownItem
						on:click={() => {
							entryButton = 'publish';
						}}
						class="flex justify-start items-center gap-1 text-lg text-blue-500 font-bold gap-1"
					>
						<Icon icon="bi:hand-thumbs-up-fill" width="20" />
						Publish
					</DropdownItem>
					<DropdownDivider />
				{/if}

				{#if entryButton == 'unpublish'}
					<DropdownItem
						on:click={() => {
							entryButton = 'unpublish';
						}}
						class="flex justify-start items-center gap-1 text-lg text-yellow-300 font-bold gap-1"
					>
						<Icon icon="bi:pause-circle" width="20" />
						Unpublish
					</DropdownItem>
					<DropdownDivider />
				{/if}

				{#if entryButton == 'schedule'}
					<DropdownItem
						on:click={() => {
							entryButton = 'schedule';
						}}
						class="flex justify-start items-center gap-1 text-lg text-pink-300 font-bold gap-1"
					>
						<Icon icon="bi:clock" width="20" />
						Schedule
					</DropdownItem>
					<DropdownDivider />
				{/if}

				{#if entryButton == 'clone'}
					<DropdownItem
						on:click={() => {
							entryButton = 'clone';
						}}
						class="flex justify-start items-center gap-1 text-lg font-bold gap-1"
					>
						<Icon icon="bi:clipboard-data-fill" width="20" />
						Clone
					</DropdownItem>
					<DropdownDivider />
				{/if}

				{#if entryButton == 'delete'}
					<DropdownItem
						on:click={() => {
							entryButton = 'delete';
						}}
						class="flex justify-start items-center text-lg text-red-600 font-bold gap-1"
					>
						<Icon icon="bi:trash3-fill" width="20" />
						Delete
					</DropdownItem>
				{/if}
			</Dropdown>
		</ButtonGroup>
	</div>

	<Table hoverable={true} class="relative">
		<TableHead>
			<TableHeadCell
				><div class="flex  justify-center items-center gap-1">
					#
					{#if !sort}
						{#if !order}
							<button on:click={() => (order = !order)}
								><div class="flex-col">
									<Icon icon="bi:caret-up-fill" color="base" width="14" class="" />
									<Icon icon="bi:caret-down" color="gray" width="14" class="-mt-1" />
								</div></button
							>
						{:else}
							<button on:click={() => (order = !order)}
								><div class="flex-col ">
									<Icon icon="bi:caret-up" color="gray" width="14" class="" />
									<Icon icon="bi:caret-down-fill" color="base" width="14" class="-mt-1" />
								</div></button
							>
						{/if}
					{/if}
				</div></TableHeadCell
			>
			{#each collection.fields as field}
				<TableHeadCell
					><div class="flex  justify-center items-center gap-1">
						{field.title}
						{#if !sort}
							{#if !order}
								<button on:click={() => (order = !order)}
									><div class="flex-col">
										<Icon icon="bi:caret-up-fill" color="base" width="14" class="" />
										<Icon icon="bi:caret-down" color="gray" width="14" class="-mt-1" />
									</div></button
								>
							{:else}
								<button on:click={() => (order = !order)}
									><div class="flex-col ">
										<Icon icon="bi:caret-up" color="gray" width="14" class="" />
										<Icon icon="bi:caret-down-fill" color="base" width="14" class="-mt-1" />
									</div></button
								>
							{/if}
						{/if}
					</div></TableHeadCell
				>
			{/each}
			<TableHeadCell
				><DeleteIcon bind:checked={deleteAll} class="ml-auto mr-[25px]" /></TableHeadCell
			>
		</TableHead>
		<TableBody>
			{#each filtered_entryList as entry, index}
				<TableBodyRow
					on:click={() => {
						showFields = true;
						$entryData = entry;
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
