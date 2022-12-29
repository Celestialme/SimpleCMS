<script lang="ts">
	import collections, { categories } from '@src/collections';
	import { shape_fields, saveFormData } from '@src/utils/utils_svelte';
	import Form from '@src/components/Form.svelte';
	import EntryList from '@src/components/EntryList.svelte';
	import { entryData, credentials } from '@src/stores/store';
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
	let visible = false;

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
	async function submit() {
		await saveFormData(collection);
		refresh(collection);
		showFields = false;
		$entryData = undefined;
	}

	$: {
		$entryData = undefined;
		collection;
	}

	// search filter
	// collection parent names should hide on search
	function updateFilter(e: KeyboardEvent) {
		filterCollections = (e.target as HTMLInputElement).value.toLowerCase();
	}
	shape_fields(collection.fields).then((data) => (fields = data));
	function is_dark() {
		return document.documentElement.classList.contains('dark');
	}

	let completionPercentage = '25%';
	let required = true;

	// import { writable } from 'svelte/store';
	// export const completionPercentage = writable(0);

	// // Update the completion percentage based on the form fields
	// function updateCompletionPercentage() {
	// 	const formFields = getFormFields();
	// 	let completedFields = 0;
	// 	formFields.forEach((field) => {
	// 		if (field.value) {
	// 			completedFields += 1;
	// 		}
	// 	});
	// 	const percentage = (completedFields / formFields.length) * 100;
	// 	completionPercentage.set(percentage);
	// }
</script>

<div class="body">
	<Alerts />

	<div class="relative flex">
		<!-- This secures all without access -->
		{#if valid}
			<div
				hidden={toggleSideBar}
				class="absolute left-0 top-0 z-20 text-white md:relative md:block"
			>
				<!-- fly out not working on sidebar with change -->
				<aside
					id="sidebarLeft"
					in:fly={{ x: -200, duration: 500 }}
					out:fly={{ x: -200, duration: 500 }}
					class="+ flex h-screen resize-x flex-col rounded-r-md bg-white px-2 shadow-xl dark:bg-gray-800 {switchSideBar
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
						class="absolute top-2 -right-4 mr-1 rounded-full border-4 border-gray-300 text-gray-500 hover:cursor-pointer hover:bg-red-600 dark:border-gray-900 dark:text-white hover:dark:bg-black hover:dark:text-red-600"
						on:click={() => (switchSideBar = !switchSideBar)}
					>
						{#if !switchSideBar}
							<Icon icon="bi:arrow-left-circle-fill" width="30" class="rotate-180" />
						{:else}
							<Icon icon="bi:arrow-left-circle-fill" width="30" />
						{/if}
					</button>

					<SidebarGroup bind:fields bind:collection bind:showFields>
						<div href="/" class="1 mt-2 flex cursor-pointer items-center justify-start">
							<SimpleCmsLogo fill="red" className="h-8 ml-[10px] hidden xl:block" />
							{#if switchSideBar}
								<span class="ml-2 mt-1 text-2xl font-bold text-black dark:text-white"
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
							<div class="my-1 ml-2 flex justify-between">
								<a href="/user" class="flex-col">
									<Avatar size="xs" class="dark:border-gray border-2 border-gray-400" />
									<div class="text-[9px] text-gray-400 dark:text-white">Admin</div>
								</a>
								<Tooltip placement="right" stlye="auto">Admin User</Tooltip>

								<Button size="xs" color="alternative" class="border-0">Eng</Button>

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
									color="none"
									rounded
									class="bg-gradient-to-br from-lime-500 via-lime-500 to-lime-300 px-6 text-black"
									href="https://github.com/Celestialme/SimpleCMS"
									target="blank">Version: {env.PKG.VERSION}</Badge
								>
							</div>
						</SidebarGroup>
					{:else}
						<SidebarGroup border class="absolute bottom-0 mt-2 flex-col pb-5 text-center">
							<a href="/user" class="flex-col ">
								<Avatar size="xs" class="dark:border-gray m-auto border-2 border-gray-400" />
								<div class="text-[9px] text-gray-400 dark:text-white">Admin</div>
							</a>
							<Tooltip placement="right" stlye="auto">Admin User</Tooltip>

							<Button size="xs" color="alternative" class="m-0 -ml-1 border-0 p-0 ">Eng</Button
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

			<div class="content !mt-[60px] flex-grow md:!mt-0 md:flex-grow-0">
				{#if showFields}
					<Form {fields} {collection} bind:showFields />
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
		{#if showFields}
			<div
				class="fixed h-[65px] w-full border-b-2 border-gray-800 bg-white text-center shadow dark:border-white dark:bg-gray-800 md:relative md:h-full md:w-[200px] md:border-none md:px-2"
			>
				<!-- Save button with progressbar -->

				<!-- <Button
					on:click={() => submit()}
					class="relative mt-2 mb-2 w-full max-w-[150px] text-xl md:mt-2 md:max-w-[350px]"
					submit
					gradient
					color="lime"
					><div class="relative flex items-center justify-center text-xl uppercase">
						<Icon icon="ph:floppy-disk-back" color="dark" width="30" class="mr-1" />
						Save
					</div>
					{#if required}
						
						<div class="relative mt-2 h-2 w-full rounded-full bg-gray-500">
							<div
								class="absolute bottom-0 left-0 mt-4 h-2 w-full rounded bg-blue-500"
								style="width: 50%"
							/>
							<div
								class="absolute top-0 left-0 flex h-full w-full items-center justify-center text-xs font-bold text-white"
							>
								50%
							</div>
						</div>
					{/if}
				</Button>
				<Tooltip placement="bottom" color="green">Save {collection?.name}</Tooltip> -->

				<button
					on:click={() => submit()}
					class="w-full max-w-[150px] rounded-lg bg-gradient-to-br from-lime-300 via-lime-400 to-lime-500 px-4 py-2 font-bold hover:bg-lime-500 focus:bg-lime-500 active:bg-lime-600 md:max-w-[350px]"
				>
					<div class="flex items-center justify-center text-xl uppercase">
						<Icon icon="ph:floppy-disk-back" color="dark" width="30" class="mr-1" />
						Save
					</div>
					{#if required}
						<!-- progress bar -->
						<div
							class="relative mx-auto mt-1 hidden h-2 w-[90%] rounded-full bg-gray-500 px-4 md:block"
						>
							<div
								class="absolute bottom-0 left-0 mt-4 h-2 w-full rounded bg-blue-500"
								style="width: 50%"
							/>
							<div
								class="absolute top-0 left-0 flex h-full w-full items-center justify-center text-xs font-bold text-white"
							>
								50%
							</div>
						</div>
					{/if}
				</button>
				<Tooltip placement="bottom">Save {collection?.name}</Tooltip>
				{#if required}
					<!-- progress bar -->
					<div class="relative mx-auto mt-1 h-2 w-[80%] rounded-full bg-gray-500 px-4 md:hidden">
						<div
							class="absolute bottom-0 left-0 mt-4 h-2 w-full rounded bg-blue-500"
							style="width: 50%"
						/>
						<div
							class="absolute top-0 left-0 flex h-full w-full items-center justify-center text-xs font-bold text-white"
						>
							50%
						</div>
					</div>
				{/if}
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
