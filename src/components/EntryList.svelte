<script lang="ts">
	import axios from 'axios';
	import env from '@root/env';
	import { entryData, language } from '@src/stores/store';
	import { onMount } from 'svelte';
	import DeleteIcon from './icons/DeleteIcon.svelte';

	// Skeleton
	import { tooltip } from '@skeletonlabs/skeleton';
	import { menu } from '@skeletonlabs/skeleton';

	// Icons from https://icon-sets.iconify.design/
	import Icon from '@iconify/svelte';

	import type { LinkType } from 'flowbite-svelte/types';
	import { never } from '@src/utils/utils_svelte';

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
	let rows = [];
	let page = 1;
	let totalPages = [];
	let currentPageRows = [];

	import { writable } from 'svelte/store';
	// Is not really stored on page reload
	let itemsPerPage = writable(10);

	function changeItemsPerPage(newValue: number) {
		itemsPerPage.set(newValue);
		// refresh itemsPerPage??
		refresh(collection);
	}

	// need to arrows on mobile only
	// first & Last should be added
	let pages = [
		{ name: 1, href: '/' },
		{ name: 2, href: '/' },
		{ name: 3, href: '/' },
		{ name: 4, href: '/' },
		{ name: 5, href: '/' }
	] as Array<LinkType>;
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

<div class="relative -mt-[65px] md:mt-0">
	<div class="mb-2 flex items-center gap-2">
		<!-- hamburger -->
		<div class="flex items-center">
			<button
				class="btn btn-sm -mr-2 sm:mr-0 md:hidden"
				on:click={() => (toggleSideBar = !toggleSideBar)}
			>
				<span>
					<svg viewBox="0 0 100 80" class="fill-token h-4 w-4">
						<rect width="100" height="20" />
						<rect y="30" width="100" height="20" />
						<rect y="60" width="100" height="20" />
					</svg>
				</span>
			</button>
		</div>

		<div class="flex w-80 flex-col">
			<div class="mb-2 text-xs capitalize text-gray-600 dark:text-gray-400">{category}</div>
			<div
				class="-mt-2 flex items-center justify-start text-sm font-bold uppercase dark:text-white md:text-xl xl:text-2xl "
			>
				<span>
					<Icon icon={collection.icon} width="24" class="mr-1 sm:mr-2" /></span
				>{collection.name}
			</div>
		</div>

		<!-- expanding Search box  
			lightmode needs more work
		-->
		<div class="mx-auto max-w-md">
			<div class="relative mx-auto w-max">
				<input
					on:keyup={search}
					placeholder="Search {collection.name} ..."
					class="relative z-10 mt-[2px] h-10 w-10 cursor-pointer rounded-full border border-gray-700 bg-gray-300/50 pl-12 text-black outline-none focus:w-full focus:cursor-text focus:rounded-md dark:bg-gray-600/50 dark:text-white md:mt-0 md:h-12 md:w-12 md:w-full "
				/>
				<!-- searchIcon -->
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="absolute inset-y-0 my-auto h-8 w-12 border-transparent stroke-black px-3.5 dark:stroke-white "
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
			</div>
		</div>

		<!-- language switcher for entryList -->
		<span class="relative rounded-md shadow-xl">
			<button
				use:menu={{ menu: 'ContentLang' }}
				class="btn flex items-center justify-center rounded-md border border-gray-600 px-2 pt-1 pr-0 uppercase md:pt-2"
			>
				<Icon icon="bi:translate" color="dark" width="22" class="-mr-2 md:mr-1" />
				<span class="hidden sm:block">{$language}</span>
				<Icon icon="mdi:chevron-down" width="24" />
			</button>
			<nav
				class="list-nav card w-[95px] border bg-gray-600 p-2 text-center text-white shadow-xl transition duration-150 ease-in-out hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:ring-0 active:bg-gray-700 dark:bg-gray-300 dark:text-black"
				data-menu="ContentLang"
			>
				<ul class="divide-y">
					{#each Object.keys(env.translations).filter((data) => $language != data) as _language}
						<li
							on:click={() => {
								$language = _language;
								open = false;
							}}
						>
							{env.translations[_language]}
						</li>
					{/each}
				</ul>
			</nav>
		</span>

		<!-- create/publish/unpublish/schedule/clone/delete -->
		<div class="flex items-center justify-center">
			<!-- the actual buttons -->
			<div
				class="inline-flex rounded-l-full rounded-r shadow-md hover:shadow-lg focus:shadow-lg"
				role="group"
			>
				{#if entryButton == 'create'}
					<button
						on:click={() => {
							showFields = true;
						}}
						use:tooltip={{ content: 'Create ' + collection.name, position: 'bottom' }}
						class="flex w-[60px] items-center justify-center rounded-l-full border-r-2 border-white bg-gradient-to-br from-lime-500 via-lime-400 to-lime-300 px-2 py-2 text-xl font-bold text-black md:ml-auto md:w-[150px]"
					>
						<Icon icon="ic:round-plus" color="black" width="22" class="mr-1" />
						<div class="hidden md:block">Create</div>
					</button>
				{:else if entryButton == 'publish'}
					<button
						class="flex w-[60px] items-center justify-center rounded-l-full border-r-2 border-white bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 px-2 py-2 text-xl font-bold text-white md:ml-auto md:w-[150px]"
						on:click={() => {
							publishEntry();
						}}
						use:tooltip={{ content: 'Publish ' + collection.name, position: 'bottom' }}
					>
						<Icon icon="bi:hand-thumbs-up-fill" color="white" width="22" class="mr-1" />
						<div class="hidden md:block">Publish</div>
					</button>
				{:else if entryButton == 'unpublish'}
					<button
						class="flex w-[60px] items-center justify-center rounded-l-full border-r-2 border-white bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-200 px-2 py-2 text-xl font-bold text-white md:ml-auto md:w-[150px]"
						on:click={() => {
							unpublishEntry();
						}}
						use:tooltip={{ content: 'Unpublish ' + collection.name, position: 'bottom' }}
					>
						<Icon icon="bi:pause-circle" color="white" width="22" class="mr-1" />
						<div class="hidden md:block">Unpublish</div>
					</button>
				{:else if entryButton == 'schedule'}
					<button
						class="flex w-[60px] items-center justify-center rounded-l-full border-r-2 border-white bg-gradient-to-br from-pink-600 via-pink-500 to-pink-400 px-2 py-2 text-xl font-bold text-white md:ml-auto md:w-[150px]"
						on:click={() => {
							scheduleEntry();
						}}
						use:tooltip={{ content: 'Schedule ' + collection.name, position: 'bottom' }}
					>
						<Icon icon="bi:clock" color="white" width="22" class="mr-1" />
						<div class="hidden md:block">Schedule</div>
					</button>
				{:else if entryButton == 'clone'}
					<button
						class="flex w-[60px] items-center justify-center rounded-l-full border-r-2 border-white bg-gradient-to-br from-gray-600 via-gray-500 to-gray-400 px-2 py-2 text-xl font-bold text-white md:ml-auto md:w-[150px]"
						on:click={() => {
							cloneEntry();
						}}
						use:tooltip={{ content: 'Clone ' + collection.name, position: 'bottom' }}
					>
						<Icon icon="bi:clipboard-data-fill" color="white" width="22" class="mr-1" />
						<div class="hidden md:block">Clone</div>
					</button>
				{:else if entryButton == 'delete'}
					<button
						class="flex w-[60px] items-center justify-center rounded-l-full border-r-2 border-white bg-gradient-to-br from-red-600 via-red-500 to-red-400 px-2 py-2 text-xl font-bold text-white md:ml-auto md:w-[150px]"
						on:click={() => {
							deleteEntry();
						}}
						use:tooltip={{ content: 'Delete ' + collection.name, position: 'bottom' }}
					>
						<Icon icon="bi:trash3-fill" color="white" width="22" class="mr-1" />
						<div class="hidden md:block">Delete</div>
					</button>
				{/if}

				<!-- Dropdown selection -->
				<button
					use:menu={{ menu: 'entrySelect', interactive: true }}
					class="relative mr-1 inline-block rounded-l-none rounded-r bg-gray-600 px-2 text-xs font-medium uppercase leading-tight text-white transition duration-150 ease-in-out hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:ring-0 active:bg-gray-700"
				>
					<Icon icon="mdi:chevron-down" width="24" /></button
				>

				<nav
					class="list-nav card mt-14 mr-1 w-52 border bg-gray-600 p-2 shadow-xl dark:border-none dark:bg-gray-300"
					data-menu="entrySelect"
				>
					<ul>
						{#if entryButton != 'create'}
							<li>
								<button
									on:click={() => {
										entryButton = 'create';
									}}
									class="btn flex w-full items-center justify-center gap-1 rounded-md border bg-gradient-to-br from-lime-500 via-lime-400 to-lime-300 text-lg font-bold text-gray-800"
								>
									<Icon icon="ic:round-plus" width="22" />
									Create
								</button>
							</li>{/if}
						{#if entryButton != 'publish'}
							<li>
								<button
									on:click={() => {
										entryButton = 'publish';
									}}
									class="btn flex w-full items-center justify-center gap-1 rounded-md border bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 text-lg font-bold text-white"
								>
									<Icon icon="bi:hand-thumbs-up-fill" width="20" />
									Publish
								</button>
							</li>
						{/if}
						{#if entryButton != 'unpublish'}
							<li>
								<button
									on:click={() => {
										entryButton = 'unpublish';
									}}
									class="btn flex w-full items-center justify-center gap-1 rounded-md border bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-200 text-lg font-bold text-white "
								>
									<Icon icon="bi:pause-circle" width="20" />
									Unpublish
								</button>
							</li>
						{/if}
						{#if entryButton != 'schedule'}
							<li>
								<button
									on:click={() => {
										entryButton = 'schedule';
									}}
									class="btn flex w-full items-center justify-center gap-1 rounded-md border bg-gradient-to-br from-pink-600 via-pink-500 to-pink-400 text-lg font-bold text-white "
								>
									<Icon icon="bi:clock" width="20" />
									Schedule
								</button>
							</li>
						{/if}
						{#if entryButton != 'clone'}
							<li>
								<button
									on:click={() => {
										entryButton = 'clone';
									}}
									class="btn flex w-full items-center justify-center gap-1 rounded-md border bg-gradient-to-br from-gray-600 via-gray-500 to-gray-400 text-lg font-bold text-white "
								>
									<Icon icon="bi:clipboard-data-fill" width="20" />
									Clone
								</button>
							</li>
						{/if}
						{#if entryButton != 'delete'}
							<li>
								<button
									on:click={() => {
										entryButton = 'delete';
									}}
									class="btn flex w-full items-center justify-center gap-1 rounded-md border bg-gradient-to-br from-red-700  via-red-600 to-red-500 text-lg font-bold text-white "
								>
									<Icon icon="bi:trash3-fill" width="20" />
									Delete
								</button>
							</li>
						{/if}
					</ul>
				</nav>
			</div>
		</div>
	</div>

	<!-- Show Collection Table -->
	<div class="table-container max-h-[80vh] overflow-auto shadow-xl">
		<table class="table-hover fixed_header table">
			<thead class="sticky top-0">
				<tr class="bg-gray-600 dark:bg-inherit">
					<th><DeleteIcon bind:checked={deleteAll} /></th>

					<th class={never('text-white')}>#</th>

					{#each collection.fields as field}
						<th class={never('text-white')}>
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
												<Icon icon="bi:caret-down-fill" color="gray" width="14" class="-mt-1" />
											</div></button
										>
									{:else}
										<button>
											<div class="flex-col ">
												<Icon icon="bi:caret-up-fill" color="gray" width="14" class="" />
												<Icon icon="bi:caret-down-fill" color="base" width="14" class="-mt-1" />
											</div></button
										>
									{/if}
								{/if}
							</div></th
						>
					{/each}
				</tr>
			</thead>

			<tbody class="table-row-group">
				{#each filtered_entryList as entry, index}
					<tr
						on:click={() => {
							showFields = true;
							$entryData = entry;
						}}
					>
						<td>
							<DeleteIcon bind:checked={deleteMap[index]} />
						</td>

						<td>{index + 1}</td>
						{#key $language}
							{#each collection.fields as field}
								{#await field?.display?.(entry[field.title], field, entry)}
									<td class="">Loading...</td>
								{:then display}
									{((entry.displays = {}), '')}
									<td class="">{@html (entry.displays[field.title] = display)}</td>
								{/await}
							{/each}
						{/key}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<div class="flex items-center justify-between  border-gray-200 p-2 ">
	<div class="flex flex-1 items-center justify-between">
		<div class="hidden text-sm text-gray-700 dark:text-gray-400 sm:block">
			Showing <span class="font-semibold text-gray-900 dark:text-white">1</span>
			to
			<span class="font-semibold text-gray-900 dark:text-white">{$itemsPerPage}</span>
			of
			<span class="font-semibold text-gray-900 dark:text-white"
				>{1 + collection.fields.length}
			</span>
			Entries
		</div>

		<span class="relative rounded-md">
			<button
				use:menu={{ menu: 'pageItems' }}
				class="btn flex items-center justify-center rounded-md border border-gray-600 px-2 uppercase"
			>
				{$itemsPerPage}
				<Icon icon="mdi:chevron-down" width="24" />
			</button>
			<nav
				class="list-nav card w-[100px] cursor-pointer border bg-gray-600 p-2 text-center text-white shadow-xl dark:bg-gray-300 sm:absolute sm:top-0 sm:-left-6"
				data-menu="pageItems"
			>
				<ul class="divide-y">
					<li
						class="-mx-2 transition duration-150 ease-in-out hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:ring-0 active:bg-gray-700 dark:text-black hover:dark:text-white"
						value={25}
						on:click={() => changeItemsPerPage(25)}
					>
						25 Entries
					</li>
					<li
						class="-mx-2 transition duration-150 ease-in-out hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:ring-0 active:bg-gray-700 dark:text-black hover:dark:text-white"
						value={50}
						on:click={() => changeItemsPerPage(50)}
					>
						50 Entries
					</li>
					<li
						class="-mx-2 transition duration-150 ease-in-out hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:ring-0 active:bg-gray-700 dark:text-black hover:dark:text-white"
						value={100}
						on:click={() => changeItemsPerPage(100)}
					>
						100 Entries
					</li>
					<li
						class="-mx-2 transition duration-150 ease-in-out hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:ring-0 active:bg-gray-700 dark:text-black hover:dark:text-white"
						value={500}
						on:click={() => changeItemsPerPage(500)}
					>
						500 Entries
					</li>
				</ul>
			</nav>
		</span>

		<div class="dark:text-white">
			<nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
				<a
					on:click={previous}
					href="#"
					class="relative inline-flex items-center rounded-l-md border border-gray-500 px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
				>
					<span class="sr-only">Previous</span>
					<Icon icon="mdi:chevron-left" width="24" />
				</a>
				<a
					href="#"
					aria-current="page"
					class="relative inline-flex items-center border border-gray-500 px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
					>1</a
				>
				<a
					href="#"
					class="relative inline-flex items-center border border-gray-500 px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
					>2</a
				>
				<a
					href="#"
					class="relative inline-flex items-center border border-gray-500 px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
					>3</a
				>

				<a
					href="#"
					class="relative inline-flex items-center border border-gray-500 px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
					>4</a
				>
				<a
					href="#"
					class="relative inline-flex items-center border border-gray-500 px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
					>5</a
				>
				<a
					on:click={next}
					href="#"
					class="relative inline-flex items-center rounded-r-md border border-gray-500 px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
				>
					<span class="sr-only">Next</span>
					<Icon icon="mdi:chevron-right" width="24" />
				</a>
			</nav>
		</div>
	</div>
</div>

<style>
	@import '@skeletonlabs/skeleton/styles/all.css';
	@import '@skeletonlabs/skeleton/styles/elements.css';
	@import '@skeletonlabs/skeleton/styles/elements/tables.css';
	.fixed_header {
		table-layout: fixed;
		border-collapse: collapse;
	}

	.fixed_header tbody {
		display: block;
		width: 100%;
		overflow: auto;
		max-height: 70vh;
	}

	.fixed_header thead tr {
		display: block;
	}

	.fixed_header th,
	.fixed_header td {
		padding: 5px;
		text-align: left;
		width: 200px;
	}
</style>
