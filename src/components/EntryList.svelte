<script lang="ts">
	import axios from 'axios';
	import env from '@root/env';
	import { entryData, language } from '@src/stores/store';
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

		<!-- expanding search -->
		<!-- Search box -->
		<div class="relative flex w-[50%] items-center justify-center pr-[20px]">
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
				class="absolute right-0 mr-[20px] px-2 outline-none"
			>
				<Icon icon="bi:filter-circle" color="gray" width="22" class="block" />
			</button>
		</div>

		<!-- create/publish/unpublish/schedule/clone/delete -->
		<ButtonGroup>
			{#each ['create', 'publish', 'unpublish', 'schedule', 'clone', 'delete'] as button}
				{#if entryButton == button}
					<!-- yellow and clone button gradient not working -->
					<Button
						gradient={button == 'create' ||
							button == 'publish' ||
							button == 'schedule' ||
							button == 'delete'}
						pill
						color={button == 'create'
							? 'lime'
							: button == 'publish'
							? 'blue'
							: button == 'unpublish'
							? 'yellow'
							: button == 'schedule'
							? 'pink'
							: button == 'clone'
							? 'red'
							: 'light'}
						class="w-[150px] !p-2 text-xl md:ml-auto"
						on:click={() => {
							if (button == 'create') {
								showFields = true;
							} else if (button == 'publish') {
								publishEntry();
							} else if (button == 'unpublish') {
								unpublishEntry();
							} else if (button == 'schedule') {
								scheduleEntry();
							} else if (button == 'clone') {
								cloneEntry();
							} else if (button == 'delete') {
								deleteEntry();
							}
						}}
					>
						<Icon
							icon={button == 'create'
								? 'ic:round-plus'
								: button == 'publish'
								? 'bi:hand-thumbs-up-fill'
								: button == 'unpublish'
								? 'bi:pause-circle'
								: button == 'schedule'
								? 'bi:clock'
								: button == 'clone'
								? 'bi:clipboard-data-fill'
								: 'bi:trash3-fill'}
							color="white"
							width="22"
							class="mr-1"
						/>
						{button == 'create'
							? 'Create'
							: button == 'publish'
							? 'Publish'
							: button == 'unpublish'
							? 'Unpublish'
							: button == 'schedule'
							? 'Schedule'
							: button == 'clone'
							? 'Clone'
							: 'Delete'}
					</Button>
					<Tooltip placement="bottom" style="light" class="z-20">
						{(button == 'create'
							? 'CREATE '
							: button == 'publish'
							? 'PUBLISH '
							: button == 'unpublish'
							? 'UnPUBLISH '
							: button == 'schedule'
							? 'SCHEDULE '
							: button == 'clone'
							? 'CLONE '
							: 'DELETE ') + collection.name}
					</Tooltip>
				{/if}
			{/each}

			<Button class="rounded-r-xl px-1 "><ChevronDown /></Button>
			<Dropdown>
				{#if entryButton == 'create'}{:else}
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

				{#if entryButton == 'publish'}{:else}
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

				{#if entryButton == 'unpublish'}{:else}
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

				{#if entryButton == 'schedule'}{:else}
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

				{#if entryButton == 'clone'}{:else}
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

				{#if entryButton == 'delete'}{:else}
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
