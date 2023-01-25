<script lang="ts">
	import collections, { categories } from '@src/collections';
	import { shape_fields, saveFormData } from '@src/utils/utils_svelte';
	import Form from '@src/components/Form.svelte';
	import EntryList from '@src/components/EntryList.svelte';
	import { entryData, credentials, is_dark } from '@src/stores/store';
	import Collections from '@src/components/Collections.svelte';
	// import Alerts from '@src/components/Alerts.svelte';
	import { fly } from 'svelte/transition';
	import axios from 'axios';
	import env from '@root/env';
	import { goto } from '$app/navigation';

	import ToolTip from '@src/components/ToolTip.svelte';

	// skeleton
	import { Avatar } from '@skeletonlabs/skeleton';
	let avatarSrc = '';
	import { menu } from '@skeletonlabs/skeleton';
	import { Modal, modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
	import { Toast, toastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';

	// Icons from https://icon-sets.iconify.design/
	import Icon from '@iconify/svelte';

	// typesafe-i18n
	import { setLocale } from '@src/i18n/i18n-svelte';
	import LL from '@src/i18n/i18n-svelte';

	import SimpleCmsLogo from '@src/components/icons/SimpleCMS_Logo.svelte';

	let valid = false;
	let collection = collections[0];
	let filterCollections = '';
	let fields: any;
	let refresh: (collection: any) => Promise<any>;
	let showFields = false;
	let category = categories[0].category;

	let deleteMode: boolean;
	// show/hide Sidebar
	let toggleSideBar = false;
	// change sidebar width so only icons show
	let switchSideBar = true;

	axios
		.post(
			`/api/validateSession`,
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

		const t: ToastSettings = {
			message: $LL.SBL_Save_message(),
			// Optional: Presets for primary | secondary | tertiary | warning
			preset: 'success',
			// Optional: The auto-hide settings
			autohide: true,
			timeout: 3000
		};
		toastStore.trigger(t);
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
		$is_dark = window.document.documentElement.classList.toggle('dark');
		localStorage.setItem('is_dark', $is_dark ? 'true' : 'false');
	};

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
	<div class="relative flex">
		<!-- This secures all without access -->

		{#if valid}
			<Modal />
			<Toast />

			<div
				hidden={toggleSideBar}
				class="absolute left-0 top-0 z-20  text-white md:relative md:block"
			>
				<!-- fly out not working on sidebar with change -->
				<aside
					id="sidebarLeft"
					in:fly={{ x: -200, duration: 500 }}
					out:fly={{ x: -200, duration: 500 }}
					class="+ mr-2 flex h-screen resize-x flex-col border-r border-surface-400 bg-white px-2 shadow-xl dark:bg-surface-800 {switchSideBar
						? 'w-[225px]'
						: 'w-[80px]'}"
				>
					{#if !switchSideBar}
						<!-- hamburger -->
						<div class="flex items-center md:hidden">
							<button
								class="btn btn-sm mt-2 -ml-2 text-white "
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
						class="absolute top-2 -right-2 mr-1 rounded-full border-2 border-surface-300"
						on:click={() => (switchSideBar = !switchSideBar)}
					>
						{#if !switchSideBar}
							<!-- Icon Collpased -->
							<Icon
								icon="bi:arrow-left-circle-fill"
								width="30"
								class="rotate-180 rounded-full bg-white text-surface-500 hover:cursor-pointer hover:bg-error-600 dark:text-surface-600 dark:hover:bg-error-600  "
							/>
						{:else}
							<!-- Icon expanded -->
							<Icon
								icon="bi:arrow-left-circle-fill"
								width="30"
								class="rounded-full bg-white text-surface-500 hover:cursor-pointer hover:bg-error-600 dark:text-surface-600 dark:hover:bg-error-600"
							/>
						{/if}
					</button>

					<a href="/" class="1 mt-2 flex cursor-pointer items-center justify-start !no-underline ">
						<SimpleCmsLogo fill="red" className="h-8 ml-[10px] " />
						{#if switchSideBar}
							<span class="ml-2 mt-1 text-2xl font-bold text-black dark:text-white"
								>{env.SITENAME}</span
							>
						{/if}
					</a>

					<!-- Search Collections perhap overflow is better? -->
					<div class="mx-auto my-2 max-w-full">
						<div class="relative mx-auto ">
							{#if !switchSideBar}
								<input
									on:keyup={updateFilter}
									on:focus={() => (switchSideBar = !switchSideBar)}
									placeholder={$LL.SBL_Search()}
									class="relative z-10 h-10 w-10 cursor-pointer !rounded-full border border-surface-700 bg-surface-300/50 pl-12 text-black shadow-xl outline-none focus:w-full focus:cursor-text focus:rounded-sm dark:bg-surface-600/50 dark:text-white md:mt-0 md:h-12"
								/>
							{:else}
								<input
									on:keyup={updateFilter}
									placeholder={$LL.SBL_Search()}
									class="relative z-10 h-10 w-full cursor-pointer rounded-md border border-surface-700 bg-surface-300/50 pl-12 text-black shadow-xl outline-none focus:cursor-text dark:bg-surface-600/50 dark:text-white"
								/>
							{/if}

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
						<div class="mt-auto border-t border-surface-500 pt-2 ">
							<div class="my-1 flex items-center justify-between">
								<a href="/user" class="relative flex-col">
									<ToolTip
										text={$LL.SBL_Admin_User()}
										position="right"
										class="bg-surface-500 text-black dark:text-white"
									/>

									<Avatar
										src={avatarSrc || '/Default_User.svg'}
										class=" border border-surface-400"
									/>
									<div class="text-center text-[9px] text-surface-400 dark:text-white">
										{$LL.SBL_Admin()}
									</div>
								</a>

								<!-- System Language desktop -->
								<span class="relative">
									<button
										use:menu={{ menu: 'system-language' }}
										class="text-surface-500 dark:text-white"
									>
										<ToolTip
											text={$LL.SBL_SystemLanguage()}
											position="right"
											class="bg-surface-500 text-black dark:text-white"
										/>Eng</button
									>

									<!-- Menu: set a matching 'data-menu-[menuId]' attribute -->
									<nav
										class="list-nav card w-40 bg-surface-500 p-2 shadow-xl dark:border"
										data-menu="system-language"
									>
										<ul class="divide-y-2">
											<li>
												<button on:click={() => setLocale('en')}>{$LL.SBL_English()} </button>
											</li>
											<li>
												<button on:click={() => setLocale('de')}>{$LL.SBL_German()} </button>
											</li>
										</ul>
									</nav>
								</span>

								<button
									on:click={toggleTheme}
									class="btn btn-sm relative rounded p-2.5 text-sm text-surface-500 hover:bg-surface-100 focus:outline-none focus:ring-4 focus:ring-surface-200 dark:text-surface-400 dark:hover:bg-surface-700 dark:focus:ring-surface-700"
								>
									{#if $is_dark}
										<Icon icon="bi:sun" width="16" />
									{:else}
										<Icon icon="bi:moon-fill" width="16" />
									{/if}
									<ToolTip
										position="right"
										text={`Switch to ${$is_dark ? 'Light' : 'Dark'} Mode`}
										class="bg-surface-500 text-black dark:text-white"
									/>
								</button>
							</div>

							<div class="flex justify-center p-1 pb-2">
								<a href="https://github.com/Celestialme/SimpleCMS" target="blank">
									<span class="badge variant-filled-primary rounded-xl text-black"
										>{$LL.SBL_Version()}: {env.PKG.VERSION}</span
									>
								</a>
							</div>
						</div>
					{:else}
						<!-- Sidebar left footer mobile -->
						<div
							class="absolute bottom-0 mt-2 flex-col border-t border-surface-500 pb-5 pt-2 text-center"
						>
							<a href="/user" class="flex-col">
								<ToolTip
									text={$LL.SBL_Admin_User()}
									position="right"
									class="bg-surface-500 text-black dark:text-white"
								/>
								<Avatar
									src={avatarSrc || '/Default_User.svg'}
									class="m-auto border border-surface-400"
								/>
								<div class="text-[9px] text-surface-400 dark:text-white">{$LL.SBL_Admin()}</div>
							</a>

							<!-- System Language Mobile -->
							<span class="relative">
								<!-- Trigger: apply the 'use:menu' action and supply the unique menu ID -->
								<button
									use:menu={{ menu: 'system-language' }}
									class="text-surface-500 dark:text-white">Eng</button
								>
								<ToolTip
									text={$LL.SBL_SystemLanguage()}
									position="right"
									class="bg-surface-500 text-black dark:text-white"
								/>

								<!-- Menu: set a matching 'data-menu-[menuId]' attribute -->
								<nav
									class="list-nav card mt-2 w-40 bg-surface-500 p-2 shadow-xl dark:border"
									data-menu="system-language"
								>
									<ul class="divide-y-2">
										<li>
											<button on:click={() => setLocale('en')}>{$LL.SBL_English()}</button>
										</li>
										<li><button on:click={() => setLocale('de')}>{$LL.SBL_German()}</button></li>
									</ul>
								</nav>
							</span>

							<div class="-ml-2">
								<button
									on:click={toggleTheme}
									class="btn btn-sm relative rounded p-2.5 text-sm text-surface-500 hover:bg-surface-100 focus:outline-none focus:ring-4 focus:ring-surface-200 dark:text-surface-400 dark:hover:bg-surface-700 dark:focus:ring-surface-700"
								>
									{#if $is_dark}
										<Icon icon="bi:sun" width="16" />
									{:else}
										<Icon icon="bi:moon-fill" width="16" />
									{/if}
									<ToolTip
										position="right"
										text={`Switch to ${$is_dark ? 'Light' : 'Dark'} Mode`}
										class="bg-surface-500 text-black dark:text-white"
									/>
								</button>
							</div>

							<a href="https://github.com/Celestialme/SimpleCMS" target="blank">
								<span class="badge variant-filled-primary mt-2 rounded-xl text-black"
									>{$LL.SBL_Ver()} {env.PKG.VERSION}</span
								>
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
				class="fixed h-[65px] w-full border-b-2 border-surface-800 bg-white text-center shadow dark:border-white dark:bg-surface-800 md:relative md:h-full md:w-[200px] md:border-none md:px-2"
			>
				<!-- Save button with progressbar -->
				<button
					on:click={() => submit()}
					class="w-full max-w-[150px] rounded-lg bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 px-4 py-2 font-bold hover:bg-primary-500 focus:bg-primary-500 active:bg-primary-600 md:mt-2 md:max-w-[350px]"
				>
					<ToolTip
						position="right"
						text="{$LL.SBL_Save()} {collection?.name}"
						class="bg-surface-500 text-black dark:text-white"
					/>
					<div class=" flex items-center justify-center text-xl uppercase">
						<Icon icon="ph:floppy-disk-back" color="dark" width="30" class="mr-1" />
						{$LL.SBL_Save()}
					</div>
					{#if required}
						<!-- progress bar sidebar-->
						<div
							class="relative mx-auto mt-1 hidden h-2 w-[90%] rounded-full bg-surface-500 px-4 md:block"
						>
							<div
								class="absolute bottom-0 left-0 mt-4 h-2 w-full rounded bg-tertiary-500"
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
					<!-- progress bar top -->
					<div
						class="relative mx-auto mt-1 h-2 w-[70%] max-w-[300px] rounded-full bg-surface-500 px-4 md:hidden"
					>
						<div
							class="absolute bottom-0 left-0 mt-4 h-2 w-full rounded bg-tertiary-500"
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
