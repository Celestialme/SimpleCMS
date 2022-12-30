<script lang="ts">
	import collections, { categories } from '@src/collections';
	import { shape_fields, saveFormData } from '@src/utils/utils_svelte';
	import Form from '@src/components/Form.svelte';
	import EntryList from '@src/components/EntryList.svelte';
	import { entryData, credentials } from '@src/stores/store';
	import Collections from '@src/components/Collections.svelte';
	import Alerts from '@src/components/Alerts.svelte';
	import { fly } from 'svelte/transition';
	import axios from 'axios';
	import env from '@root/env';
	import { goto } from '$app/navigation';

	// skeleton
	import { Avatar } from '@skeletonlabs/skeleton';
	let avatarSrc = null;
	import { menu } from '@skeletonlabs/skeleton';
	import { tooltip } from '@skeletonlabs/skeleton';

	// Icons from https://icon-sets.iconify.design/
	import Icon from '@iconify/svelte';

	import SimpleCmsLogo from '@src/components/icons/SimpleCMS_Logo.svelte';

	let expanded = false;
	let toggle = true;
	let searchbutton;

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

	// darkmode - is this still required?
	const toggleTheme = () => {
		const isDark = window.document.documentElement.classList.toggle('dark');
		localStorage.setItem('color-theme', isDark ? 'dark' : 'light');
	};

	function is_dark() {
		return document.documentElement.classList.contains('dark');
	}

	console.log(is_dark);

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
					class="+ mr-2 flex h-screen resize-x flex-col rounded-r-md bg-white px-2 shadow-xl dark:bg-gray-800 {switchSideBar
						? 'w-[225px]'
						: 'w-[80px]'}"
				>
					{#if !switchSideBar}
						<!-- hamburger -->
						<div class="flex items-center md:hidden">
							<button
								class="btn btn-sm mt-2 -ml-2 "
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
					{/if}

					<!-- sidebar collapse button -->
					<button
						class="absolute top-2 -right-2 mr-1 rounded-full border-4 border-gray-300 text-gray-500 hover:cursor-pointer hover:bg-red-600 dark:border-gray-900 dark:text-white hover:dark:bg-black hover:dark:text-red-600"
						on:click={() => (switchSideBar = !switchSideBar)}
					>
						{#if !switchSideBar}
							<Icon icon="bi:arrow-left-circle-fill" width="30" class="rotate-180" />
						{:else}
							<Icon icon="bi:arrow-left-circle-fill" width="30" />
						{/if}
					</button>

					<a href="/" class="1 mt-2 flex cursor-pointer items-center justify-start">
						<SimpleCmsLogo fill="red" className="h-8 ml-[10px] " />
						{#if switchSideBar}
							<span class="ml-2 mt-1 text-2xl font-bold text-black dark:text-white">SimpleCMS</span>
						{/if}
					</a>

					<!-- Search Collections -->
					<div class="mx-auto my-2 max-w-md">
						<div class="relative mx-auto w-max">
							<input
								on:keyup={updateFilter}
								placeholder="Search ..."
								class="relative z-10 h-10 w-10 cursor-pointer rounded-full border bg-transparent pl-12 text-black outline-none focus:w-full focus:cursor-text focus:rounded-md focus:pl-10 focus:pr-4 dark:bg-gray-500/50 dark:text-white lg:w-full "
							/>

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
						</div>
					</div>

					<!-- Display Collections -->
					<Collections
						data={categories}
						{filterCollections}
						{switchSideBar}
						bind:fields
						bind:collection
						bind:category
						bind:showFields
					/>

					{#if switchSideBar}
						<!-- Sidebar left footer Desktop -->
						<div class="mt-auto border-t border-gray-500 pt-2 ">
							<div class="my-1 flex items-center justify-between">
								<a
									href="/user"
									class="flex-col"
									use:tooltip={{ content: 'Admin User', position: 'right' }}
								>
									<Avatar src={avatarSrc ?? '/Default_User.svg'} class=" border border-gray-400" />
									<div class="text-center text-[9px] text-gray-400 dark:text-white">Admin</div>
								</a>

								<!-- System Language desktop -->
								<span class="relative">
									<!-- Trigger: apply the 'use:menu' action and supply the unique menu ID -->
									<button
										use:menu={{ menu: 'system-language' }}
										use:tooltip={{ content: 'System Language', position: 'right' }}
										class="text-gray-500 dark:text-white">Eng</button
									>

									<!-- Menu: set a matching 'data-menu-[menuId]' attribute -->
									<nav
										class="list-nav card w-40 bg-gray-500 p-2 shadow-xl dark:border"
										data-menu="system-language"
									>
										<ul class="divide-y-2">
											<li><a href="/">English</a></li>
											<li><a href="/">German</a></li>
										</ul>
									</nav>
								</span>

								<button
									on:click={toggleTheme}
									id="theme-toggle"
									class="btn rounded-lg p-2.5 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
									use:tooltip={{ content: 'Switch', position: 'right' }}
								>
									<Icon icon="bi:sun" width="16" id="theme-toggle-light-icon" />
									<Icon icon="bi:moon-fill" width="16" id="theme-toggle-dark-icon" />
								</button>
							</div>

							<div class="flex justify-center p-1 pb-2">
								<a href="https://github.com/Celestialme/SimpleCMS" target="blank">
									<span class="badge badge-filled-primary">Version: {env.PKG.VERSION}</span>
								</a>
							</div>
						</div>
					{:else}
						<!-- Sidebar left footer mobile -->
						<div
							class="absolute bottom-0 mt-2 flex-col border-t border-gray-500 pb-5 pt-2 text-center"
						>
							<a
								href="/user"
								class="flex-col"
								use:tooltip={{ content: 'Admin', position: 'right' }}
							>
								<Avatar
									src={avatarSrc ?? '/Default_User.svg'}
									class="m-auto border border-gray-400"
								/>
								<div class="text-[9px] text-gray-400 dark:text-white">Admin</div>
							</a>

							<!-- System Language Mobile -->
							<span class="relative">
								<!-- Trigger: apply the 'use:menu' action and supply the unique menu ID -->
								<button
									use:menu={{ menu: 'system-language' }}
									use:tooltip={{ content: 'System Language', position: 'right' }}
									class="text-gray-500 dark:text-white">Eng</button
								>

								<!-- Menu: set a matching 'data-menu-[menuId]' attribute -->
								<nav
									class="list-nav card w-40 bg-gray-500 p-2 shadow-xl dark:border"
									data-menu="system-language"
								>
									<ul class="divide-y-2">
										<li><a href="/">English</a></li>
										<li><a href="/">German</a></li>
									</ul>
								</nav>
							</span>

							<div class="-ml-2">
								<button
									on:click={toggleTheme}
									id="theme-toggle"
									class="btn rounded-lg p-2.5 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
									use:tooltip={{ content: 'Switch', position: 'right' }}
								>
									<Icon icon="bi:sun" width="16" id="theme-toggle-light-icon" />
									<Icon icon="bi:moon-fill" width="16" id="theme-toggle-dark-icon" />
								</button>
							</div>

							<a href="https://github.com/Celestialme/SimpleCMS" target="blank">
								<span class="badge badge-filled-primary">Ver. {env.PKG.VERSION}</span>
							</a>
						</div>
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

				<button
					on:click={() => submit()}
					use:tooltip={{ content: 'Save {collection?.name}', position: 'right' }}
					class="w-full max-w-[150px] rounded-lg bg-gradient-to-br from-lime-300 via-lime-400 to-lime-500 px-4 py-2 font-bold hover:bg-lime-500 focus:bg-lime-500 active:bg-lime-600 md:mt-2 md:max-w-[350px]"
				>
					<div class=" flex items-center justify-center text-xl uppercase">
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
	/* why re these import needed here and not globally in +layout? */
	@import '@skeletonlabs/skeleton/styles/all.css';
	@import '@skeletonlabs/skeleton/styles/elements.css';
	@import '@skeletonlabs/skeleton/styles/elements/tables.css';
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
