<script lang="ts">
	import collections, { categories } from '@src/collections';
	import { shape_fields, saveFormData } from '@src/utils/utils_svelte';
	import Form from '@src/components/Form.svelte';
	import EntryList from '@src/components/EntryList.svelte';
	import { prevFormData, credentials } from '@src/stores/store';
	import Collections from '@src/components/Collections.svelte';
	import Alerts from '@src/components/Alerts.svelte';
	import axios from 'axios';
	import env from '@root/env';
	import { goto } from '$app/navigation';
	import {
		Avatar,
		Badge,
		Button,
		DarkMode,
		Dropdown,
		DropdownItem,
		NavHamburger,
		Search,
		SidebarGroup,
		Tooltip
	} from 'flowbite-svelte';
	// Icons from https://icon-sets.iconify.design/
	import Icon from '@iconify/svelte';
	import { fly } from 'svelte/transition';
	import SimpleCmsLogo from '@src/components/icons/SimpleCMS_Logo.svelte';

	let valid = false;
	let collection = collections[0];
	let filterCollections = '';
	let fields: any;
	let refresh: (collection: any) => Promise<any>;
	let showFields = false;
	let category = categories[0].category;
	let deleteEntry = async () => {};
	let deleteMode: boolean;
	// show/hide Sidebar
	let toggleSideBar = false;
	// change sidebar width so only icons show
	let switchSideBar = true;

	axios
		.post(
			`${env.API}/validateSession`,
			{ sessionId: $credentials.session },
			{
				headers: {
					'content-type': 'multipart/form-data'
				}
			}
		)
		.then((response) => {
			if (response.data.status == 200) {
				$credentials = response.data;
				valid = true;
			} else {
				goto('/login');
			}
		});
	async function onSubmit(e: Event) {
		e.preventDefault();

		await saveFormData(collection);
		refresh(collection);
		showFields = false;
		$prevFormData = undefined;
	}

	$: {
		$prevFormData = undefined;
		collection;
	}

	// search filter
	function updateFilter(e: KeyboardEvent) {
		filterCollections = (e.target as HTMLInputElement).value;
	}
	shape_fields(collection.fields).then((data) => (fields = data));
	function is_dark() {
		return document.documentElement.classList.contains('dark');
	}
</script>

<div class="body">
	<Alerts />

	<div class="flex relative ">
		<!-- This secures all without access -->
		{#if valid}
			<div
				hidden={toggleSideBar}
				class="controlls text-white absolute md:relative  left-0 top-0 z-10 md:block"
			>
				<!-- fly out not working on sidebar with change -->
				<aside
					id="sidebarLeft"
					in:fly={{ x: -200, duration: 500 }}
					out:fly={{ x: -200, duration: 500 }}
					class="bg-white dark:bg-gray-800 h-screen shadow-xl flex flex-col px-2 resize-x rounded-r-md + {switchSideBar
						? 'w-[225px]'
						: 'w-[80px]'}"
				>
					{#if !switchSideBar}
						<NavHamburger
							btnClass="mt-2 -ml-2 xl:hidden"
							on:click={() => (toggleSideBar = !toggleSideBar)}
						/>
					{/if}

					<!-- sidebar collapse button -->
					<button
						class="absolute top-2 -right-4 mr-1 text-gray-500 dark:text-white border-4 border-gray-300 dark:border-gray-900 rounded-full hover:cursor-pointer hover:bg-red-600 hover:dark:bg-black hover:dark:text-red-600"
						on:click={() => (switchSideBar = !switchSideBar)}
					>
						{#if !switchSideBar}
							<Icon icon="bi:arrow-left-circle-fill" width="30" class="rotate-180" />
						{:else}
							<Icon icon="bi:arrow-left-circle-fill" width="30" />
						{/if}
					</button>

					<SidebarGroup bind:fields bind:collection bind:showFields>
						<div href="/" class="flex justify-start items-center cursor-pointer 1 mt-2">
							<SimpleCmsLogo fill="red" className="h-8 ml-[10px] hidden xl:block" />
							{#if switchSideBar}
								<span class="ml-2 mt-1 text-black dark:text-white text-2xl font-bold"
									>SimpleCMS</span
								>
							{/if}
						</div>

						<Search size="md" placeholder="Search ..." class="mt-3" on:keyup={updateFilter} />

						<Collections
							data={categories}
							{filterCollections}
							{switchSideBar}
							bind:fields
							bind:collection
							bind:category
							bind:showFields
						/>
					</SidebarGroup>
					{#if switchSideBar}
						<SidebarGroup border class="!mt-auto mb-5 mr-2 ">
							<div class="flex justify-between my-1 ml-2">
								<a href="/user" class="flex-col">
									<Avatar size="xs" class="border-2 border-gray-400 dark:border-gray" />
									<div class="text-[9px] text-gray-400 dark:text-white">Admin</div>
								</a>
								<Tooltip placement="right" stlye="auto">Admin User</Tooltip>

								<Button size="xs" color="alternative" class="border-0">Eng</Button>
								<!-- not working with dropdown 
									<Tooltip
									placement="right"
									stlye="auto"
									>System Language
								</Tooltip> -->
								<Dropdown color="dark" placement="right-start">
									<DropdownItem>English</DropdownItem>
									<DropdownItem>German</DropdownItem>
								</Dropdown>

								<DarkMode />

								<Tooltip placement="right" stlye="auto">
									{is_dark() ? 'Switch to Light mode' : 'Switch to Dark mode'}
								</Tooltip>
							</div>

							<div class="flex justify-center p-1 pb-2">
								<Badge
									color="green"
									rounded
									class="px-6"
									href="https://github.com/Celestialme/SimpleCMS"
									target="blank">Version: {env.PKG.VERSION}</Badge
								>
							</div>
						</SidebarGroup>
					{:else}
						<SidebarGroup border class="absolute flex-col text-center mt-2 pb-5 bottom-0">
							<a href="/user" class="flex-col ">
								<Avatar size="xs" class="border-2 border-gray-400 dark:border-gray m-auto" />
								<div class="text-[9px] text-gray-400 dark:text-white">Admin</div>
							</a>
							<Tooltip placement="right" stlye="auto">Admin User</Tooltip>

							<Button size="xs" color="alternative" class="border-0 p-0 m-0 -ml-1 ">Eng</Button
							><Dropdown placement="right-start" color="dark">
								<DropdownItem>English</DropdownItem>
								<DropdownItem>German</DropdownItem>
							</Dropdown>

							<div class="-ml-2"><DarkMode /></div>
							<Tooltip placement="right" stlye="auto"
								>{is_dark() ? 'Switch to Light mode' : 'Switch to Dark mode'}</Tooltip
							>

							<Badge
								color="green"
								rounded
								href="https://github.com/Celestialme/SimpleCMS"
								target="blank"
								class="mt-2">Ver. {env.PKG.VERSION}</Badge
							>
						</SidebarGroup>
					{/if}
				</aside>
			</div>

			<div class="content">
				{#if showFields}
					<Form {fields} {collection} bind:showFields on:submit={onSubmit} />
				{/if}

				<div hidden={showFields}>
					<EntryList
						bind:toggleSideBar
						bind:showFields
						bind:deleteEntry
						bind:deleteMode
						{collection}
						{category}
						bind:refresh
					/>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.body {
		display: flex;
		flex-direction: column;
	}
	.content {
		margin: 0 auto;
		min-width: 30%;
		max-width: 2000px;
	}
	:global(.content > *) {
		margin: 5px 0;
	}

	:global(html, body, body > div, .body) {
		width: 100vw;
		height: 100vh;
		overflow: hidden;
	}
</style>
