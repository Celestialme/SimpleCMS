<script lang="ts">
	import axios from 'axios';
	import env from '@root/env';
	import { entryData, language } from '@src/stores/store';
	import { onMount } from 'svelte';
	import DeleteIcon from './icons/DeleteIcon.svelte';
	import {
		ButtonGroup,
		Chevron,
		ChevronLeft,
		ChevronRight,
		Dropdown,
		DropdownItem,
		DropdownDivider,
		NavHamburger,
		Pagination,
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
	let open = false;

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

	export async function publishEntry() {
		alert('publish added soon');
	}
	export async function unpublishEntry() {
		alert('unpublish added soon');
	}
	export async function scheduleEntry() {
		alert('schedule added soon');
	}
	export async function cloneEntry() {
		alert('clone added soon');
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

	// Language filter incorrect
	function search(e: Event) {
		filter = (e.target as HTMLInputElement).value;
	}
</script>

<div class="relative">
	<div class="mb-2 flex items-center gap-2">
		<NavHamburger on:click={() => (toggleSideBar = !toggleSideBar)} btnClass="md:hidden mr-1" />

		<div class="flex w-80 flex-col">
			<div class="mb-2 text-xs capitalize text-gray-400">{category}</div>
			<div
				class="-mt-2 flex items-center justify-start text-sm font-bold uppercase dark:text-white md:text-xl xl:text-2xl "
			>
				<span> <Icon icon={collection.icon} width="24" class="mr-2" /></span>{collection.name}
			</div>
		</div>

		<!-- expanding Search box -->
		<div class="mx-auto max-w-md">
			<form action="" class="relative mx-auto w-max">
				<input
					on:keyup={search}
					placeholder="Search {collection.name} ..."
					class="peer relative z-10 h-12 w-12 cursor-pointer rounded-full border bg-transparent pl-12 text-black outline-none focus:w-full focus:cursor-text focus:pl-16 focus:pr-4 dark:bg-gray-500/50 dark:text-white md:w-full "
				/>
				<!-- <Icon icon="ic:baseline-search" height="24" class=" text-gray-400" /> -->
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="absolute inset-y-0 my-auto h-8 w-12 border-transparent stroke-white px-3.5 "
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
			</form>
		</div>

		<!-- language switcher for entryList -->
		<button
			class="flex items-center  justify-center rounded-lg bg-gray-600  py-3 pl-3 pr-1 text-white  hover:bg-gray-700"
			><Icon icon="bi:translate" color="dark" width="22" class="mr-1" />
			<Chevron>
				<!-- <div class="hidden md:block">
					{env.translations[$language]}
				</div> -->
			</Chevron>
		</button>
		<Dropdown bind:open>
			{#each Object.keys(env.translations) as _language}
				<!-- TODO: Dont display active language -->
				<DropdownItem
					on:click={() => {
						$language = _language;
						open = false;
					}}
					>{env.translations[_language]}
				</DropdownItem>
			{/each}
		</Dropdown>

		<!-- create/publish/unpublish/schedule/clone/delete -->
		<ButtonGroup>
			{#if entryButton == 'create'}
				<button
					class="flex w-[70px] items-center justify-center rounded-l-full bg-gradient-to-br from-lime-500 via-lime-400 to-lime-300 px-2 py-2 text-xl md:ml-auto md:w-[150px]"
					on:click={() => {
						showFields = true;
					}}
				>
					<Icon icon="ic:round-plus" color="black" width="30" class="mr-1" />
					<div class="hidden md:block">Create</div>
				</button>
				<Tooltip placement="bottom" style="light" class="z-20"
					>{'Create ' + collection.name}
				</Tooltip>
			{:else if entryButton == 'publish'}
				<button
					class="flex w-[70px] items-center justify-center rounded-l-full bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 py-2 text-xl text-white md:ml-auto md:w-[150px]"
					on:click={() => {
						publishEntry();
					}}
				>
					<Icon icon="bi:hand-thumbs-up-fill" color="white" width="22" class="mr-1" />
					<div class="hidden md:block">Publish</div>
				</button>
				<Tooltip placement="bottom" style="light" class="z-20"
					>{'Publish ' + collection.name}
				</Tooltip>
			{:else if entryButton == 'unpublish'}
				<button
					class="flex w-[70px] items-center justify-center rounded-l-full bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-200 py-2 text-xl text-white md:ml-auto md:w-[150px]"
					on:click={() => {
						unpublishEntry();
					}}
				>
					<Icon icon="bi:pause-circle" color="white" width="22" class="mr-1" />
					<div class="hidden md:block">Unpublish</div>
				</button>
				<Tooltip placement="bottom" style="light" class="z-20"
					>{'Unpublish ' + collection.name}
				</Tooltip>
			{:else if entryButton == 'schedule'}
				<button
					class="flex w-[70px] items-center justify-center rounded-l-full bg-gradient-to-br from-pink-600 via-pink-500 to-pink-400 py-2 text-xl text-white md:ml-auto md:w-[150px]"
					on:click={() => {
						scheduleEntry();
					}}
				>
					<Icon icon="bi:clock" color="white" width="22" class="mr-1" />
					<div class="hidden md:block">Schedule</div>
				</button>
				<Tooltip placement="bottom" style="light" class="z-20"
					>{'Schedule ' + collection.name}
				</Tooltip>
			{:else if entryButton == 'clone'}
				<button
					class="flex w-[70px] items-center justify-center rounded-l-full bg-gradient-to-br from-gray-600 via-gray-500 to-gray-400 py-2 text-xl text-white md:ml-auto md:w-[150px]"
					on:click={() => {
						cloneEntry();
					}}
				>
					<Icon icon="bi:clipboard-data-fill" color="white" width="22" class="mr-1" />
					<div class="hidden md:block">Clone</div>
				</button>
				<Tooltip placement="bottom" style="light" class="z-20"
					>{'Clone ' + collection.name}
				</Tooltip>
			{:else if entryButton == 'delete'}
				<button
					class="flex w-[70px] items-center justify-center rounded-l-full bg-gradient-to-br from-red-600 via-red-500 to-red-400 py-2 text-xl text-white md:ml-auto md:w-[150px]"
					on:click={() => {
						deleteEntry();
					}}
				>
					<Icon icon="bi:trash3-fill" color="white" width="22" class="mr-1" />
					<div class="hidden md:block">Delete</div>
				</button>
				<Tooltip placement="bottom" style="light" class="z-20"
					>{'Delete ' + collection.name}
				</Tooltip>
			{/if}

			<button
				class=" mr-1 rounded-r-lg border-l border-white bg-gray-600 pl-1 pr-2 text-white md:pl-2 md:pr-3 "
				><Chevron /></button
			>
			<Dropdown>
				{#if entryButton != 'create'}
					<DropdownItem
						on:click={() => {
							entryButton = 'create';
						}}
						class="-my-1 flex items-center justify-start gap-1 gap-1 bg-lime-500 text-lg font-bold text-black hover:text-white"
					>
						<Icon icon="ic:round-plus" width="22" />
						Create
					</DropdownItem>
					<DropdownDivider />
				{/if}

				{#if entryButton != 'publish'}
					<DropdownItem
						on:click={() => {
							entryButton = 'publish';
						}}
						class="flex items-center justify-start gap-1 gap-1 text-lg font-bold text-blue-500"
					>
						<Icon icon="bi:hand-thumbs-up-fill" width="20" />
						Publish
					</DropdownItem>
					<DropdownDivider />
				{/if}

				{#if entryButton != 'unpublish'}
					<DropdownItem
						on:click={() => {
							entryButton = 'unpublish';
						}}
						class="flex items-center justify-start gap-1 gap-1 text-lg font-bold text-yellow-300"
					>
						<Icon icon="bi:pause-circle" width="20" />
						Unpublish
					</DropdownItem>
					<DropdownDivider />
				{/if}

				{#if entryButton != 'schedule'}
					<DropdownItem
						on:click={() => {
							entryButton = 'schedule';
						}}
						class="flex items-center justify-start gap-1 gap-1 text-lg font-bold text-pink-300"
					>
						<Icon icon="bi:clock" width="20" />
						Schedule
					</DropdownItem>
					<DropdownDivider />
				{/if}

				{#if entryButton != 'clone'}
					<DropdownItem
						on:click={() => {
							entryButton = 'clone';
						}}
						class="flex items-center justify-start gap-1 gap-1 text-lg font-bold"
					>
						<Icon icon="bi:clipboard-data-fill" width="20" />
						Clone
					</DropdownItem>
					<DropdownDivider />
				{/if}

				{#if entryButton != 'delete'}
					<DropdownItem
						on:click={() => {
							entryButton = 'delete';
						}}
						class="flex items-center justify-start gap-1 gap-1 text-lg font-bold text-red-600"
					>
						<Icon icon="bi:trash3-fill" width="20" />
						Delete
					</DropdownItem>
				{/if}
			</Dropdown>
		</ButtonGroup>
	</div>

	<!-- show Collection data in table -->
	<Table hoverable={true} class="relative">
		<TableHead>
			<TableHeadCell>
				<DeleteIcon bind:checked={deleteAll} />
			</TableHeadCell>

			<TableHeadCell class="dark:text-white">#</TableHeadCell>

			{#each collection.fields as field}
				<TableHeadCell class="dark:text-white">
					<div
						on:click={() => {
							sort = field.name;
							order = !order;
						}}
						class="flex items-center justify-start gap-1"
					>
						{field.title}

						<!-- {#if (sort = field.name)} -->
						{#if !sort}
							{#if !order}
								<button>
									<div class="flex-col">
										<Icon icon="bi:caret-up-fill" color="base" width="14" class="" />
										<Icon icon="bi:caret-down" color="gray" width="14" class="-mt-1" />
									</div></button
								>
							{:else}
								<button>
									<div class="flex-col ">
										<Icon icon="bi:caret-up" color="gray" width="14" class="" />
										<Icon icon="bi:caret-down-fill" color="base" width="14" class="-mt-1" />
									</div></button
								>
							{/if}
						{/if}
					</div></TableHeadCell
				>
			{/each}
		</TableHead>
		<TableBody>
			{#each filtered_entryList as entry, index}
				<TableBodyRow
					on:click={() => {
						showFields = true;
						$entryData = entry;
					}}
				>
					<TableBodyCell>
						<DeleteIcon bind:checked={deleteMap[index]} />
					</TableBodyCell>

					<TableBodyCell>{index + 1}</TableBodyCell>
					{#key $language}
					{#each collection.fields as field}
						{#await field?.display?.(entry[field.title], field, entry)}
							<TableBodyCell class="">Loading...</TableBodyCell>
						{:then display}
							{((entry.displays = {}), '')}
							<TableBodyCell class="">{@html (entry.displays[field.title] = display)}</TableBodyCell
							>
						{/await}
					{/each}
					{/key}
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>

	<div class="mt-4 flex items-center justify-between gap-2">
		<div class="text-sm text-gray-700 dark:text-gray-400">
			Showing <span class="font-semibold text-gray-900 dark:text-white">{helper.start}</span> to
			<span class="font-semibold text-gray-900 dark:text-white">{helper.end}</span>
			of
			<span class="font-semibold text-gray-900 dark:text-white">{helper.total} </span> Entries
		</div>

		<Pagination {pages} on:previous={previous} on:next={next} icon class="shadow-lg">
			<svelte:fragment slot="prev">
				<span class="sr-only">Previous</span>
				<ChevronLeft class="h-5 w-5" />
			</svelte:fragment>

			<svelte:fragment slot="next">
				<span class="sr-only">Next</span>
				<ChevronRight class="h-5 w-5" />
			</svelte:fragment>
		</Pagination>
	</div>
</div>
