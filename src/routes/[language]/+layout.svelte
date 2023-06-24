<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { mode, switchSideBar, toggleLeftSidebar, toggleRightSidebar, toggleHeaderSidebar, toggleFooterSidebar, language } from '@src/stores/store';
	import { contentLanguage } from '@src/stores/load';
	import axios from 'axios';
	import { credentials } from '@src/stores/load';

	import SimpleCmsLogo from '@src/components/SimpleCMS_Logo.svelte';
	import { PUBLIC_SITENAME } from '$env/static/public';
	import ControlPanel from '@src/components/ControlPanel.svelte';
	import Collections from '@src/components/system/drawer/Collections.svelte';

	contentLanguage.set($page.params.language);

	let handleClick;

	// update the handleClick function when the systemLanguage store value changes
	$: handleClick = () => {
		if (!$page.url.href.includes('user')) {
			goto(`/${$contentLanguage}/user`);
		}
	};
	// update the href value when the systemLanguage store value changes
	$: href = `/${$contentLanguage}/builder`;

	//skeleton
	import { AppShell, AppBar, Avatar, Modal, ProgressBar, Toast, toastStore, setModeUserPrefers, setModeCurrent } from '@skeletonlabs/skeleton';
	import { modeOsPrefers, modeUserPrefers, modeCurrent } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	import { popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';

	// Popup Tooltips
	let SwitchThemeSettings: PopupSettings = {
		event: 'hover',
		target: 'SwitchTheme',
		placement: 'right'
	};

	let SignOutTooltip: PopupSettings = {
		event: 'hover',
		target: 'SignOut',
		placement: 'right'
	};

	let BuilderTooltip: PopupSettings = {
		event: 'hover',
		target: 'Builder',
		placement: 'right'
	};

	let SystemLanguageTooltip: PopupSettings = {
		event: 'hover',
		target: 'SystemLanguage',
		placement: 'right'
	};

	// Lucia
	// TODO: Fix User DATA
	// $: user = data.user;
	// $: avatarSrc = user?.avatar;
	$: avatarSrc = '';

	// typesafe-i18n
	import LL from '@src/i18n/i18n-svelte';
	import { locale } from '@src/i18n/i18n-svelte';
	import { locales } from '@src/i18n/i18n-util';
	import type { Locales } from '@src/i18n/i18n-types';
	import { systemLanguage } from '@src/stores/load';
	import { setLocale } from '@src/i18n/i18n-svelte';

	let selectedLocale = (localStorage.getItem('selectedLanguage') || $systemLanguage) as Locales;

	function handleLocaleChange(e) {
		selectedLocale = e.target.value;
		setLocale(selectedLocale);
		localStorage.setItem('selectedLanguage', selectedLocale);
	}

	// @ts-expect-error reading from vite.config.jss
	const pkg = __VERSION__;

	// darkmode
	const toggleTheme = () => {
		$modeCurrent = !$modeCurrent;
		setModeUserPrefers($modeCurrent);
		setModeCurrent($modeCurrent);
	};

	//signOut
	async function signOut() {
		let resp = (
			await axios.post(
				`/api/auth`,
				{ authType: 'signOut' },
				{
					headers: {
						'content-type': 'multipart/form-data'
					}
				}
			)
		).data;
		if (resp.status == 200) {
			$credentials = resp;
			goto(`/login`);
		}
	}
</script>

<!-- TODO: Fix Right And mobile Version of sidebars -->
<!-- <div class="flex flex-col">
	<div>toggleLeftSidebar={$toggleLeftSidebar}</div>
	<div>switchSideBar={$switchSideBar}</div>
	<div>toggleRightSidebar={$toggleRightSidebar}</div>
	<div>toggleHeaderSidebar={$toggleHeaderSidebar}</div>
	<div>toggleFooterSidebar={$toggleFooterSidebar}</div>
</div> -->

<AppShell
	slotSidebarLeft="!overflow-visible bg-white dark:bg-gradient-to-r dark:from-surface-900 dark:via-surface-700
dark:to-surface-500 text-center h-full relative border-r !px-2 border-surface-300 flex flex-col z-10 
{$switchSideBar ? 'w-[220px]' : 'w-fit'}
{$toggleLeftSidebar ? 'hidden' : 'block'}"
	slotSidebarRight="h-full relative border-r w-[200px] flex flex-col items-center bg-white border-l border-surface-300 dark:bg-gradient-to-r dark:from-surface-600 dark:via-surface-700 dark:to-surface-900 text-center 
	{$toggleRightSidebar ? 'hidden' : 'block'}"
	slotPageHeader="bg-white dark:bg-gradient-to-t dark:from-surface-600 dark:via-surface-700 dark:to-surface-900 text-center px-1 h-10 border-b relative hidden 
	{toggleHeaderSidebar ? 'hidden' : 'block'}"
	slotPageFooter="bg-white dark:bg-gradient-to-b dark:from-surface-600 dark:via-surface-700 dark:to-surface-900 text-center px-1 h-10 border-t relative hidden 
	{$toggleFooterSidebar ? 'hidden' : 'block'}"
>
	<svelte:fragment slot="sidebarLeft">
		<!-- Corporate Identity -->
		{#if $switchSideBar}
			<a href="/" class="t flex pt-2 !no-underline">
				<SimpleCmsLogo fill="red" className="h-8" />

				<span class="pl-1 text-2xl font-bold text-black dark:text-white">{PUBLIC_SITENAME}</span>
			</a>
		{:else}
			<div class="flex justify-start gap-1.5">
				<button type="button" on:click={() => toggleLeftSidebar.update((value) => !value)} class="btn-icon variant-ghost-surface mt-1">
					<iconify-icon icon="mingcute:menu-fill" width="24" />
				</button>

				<a href="/" class="flex pt-2 !no-underline">
					<SimpleCmsLogo fill="red" className="h-9  mr-2" />
				</a>
			</div>
		{/if}

		<!-- sidebar collapse button -->
		<button
			type="button"
			class="absolute -right-3 top-2 flex items-center justify-center !rounded-full border-2 border-surface-300"
			on:keydown
			on:click={() => switchSideBar.update((value) => !value)}
		>
			{#if !switchSideBar}
				<!-- Icon Collapsed -->
				<iconify-icon
					icon="bi:arrow-left-circle-fill"
					width="30"
					class="rotate-180 rounded-full bg-white text-surface-500 hover:cursor-pointer hover:bg-error-600 dark:text-surface-600 dark:hover:bg-error-600"
				/>
			{:else}
				<!-- Icon expanded -->
				<iconify-icon
					icon="bi:arrow-left-circle-fill"
					width="30"
					class="rounded-full bg-white text-surface-500 hover:cursor-pointer hover:bg-error-600 dark:text-surface-600 dark:hover:bg-error-600"
				/>
			{/if}
		</button>

		<!-- Search Collections -->
		<div class="flex w-full items-center justify-center gap-2">
			{#if !switchSideBar}
				<a href="/" class="flex !no-underline">
					<SimpleCmsLogo fill="red" className="h-8" />
				</a>
			{/if}

			<!-- add search -->
		</div>

		<!--SideBar Middle -->
		<Collections />

		<!-- Sidebar Left Footer -->
		<div class="mb-2 mt-auto bg-white dark:bg-gradient-to-r dark:from-surface-800 dark:via-surface-700 dark:to-surface-500">
			<div class="mx-1 mb-1 border-t border-surface-400" />

			<div class="{$switchSideBar ? 'grid-cols-3 grid-rows-3' : 'grid-cols-2 grid-rows-2'} grid items-center justify-center overflow-hidden">
				<!-- Avatar with user settings -->
				<div class={$switchSideBar ? 'order-1 row-span-2' : 'order-1'}>
					<button class="btn-icon hover:bg-surface-500 md:row-span-2">
						<div on:click={handleClick} on:keypress={handleClick} class="relative cursor-pointer flex-col !no-underline">
							<Avatar src={avatarSrc ? '/api/media/' + avatarSrc : '/Default_User.svg'} class="mx-auto {$switchSideBar ? 'w-[40px]' : 'w-[35px]'}" />
							<div class="text-center text-[9px] text-black dark:text-white">
								{#if $switchSideBar}
									<!-- {#if user?.username}
										<div class="text-xs uppercase">{user?.username}</div>
									{/if} -->
								{/if}
							</div>
						</div>
					</button>
				</div>

				<!-- TODO: Fix Tooltip overflow -->
				<!-- System Language i18n Handling -->
				<div class={$switchSideBar ? 'order-3 row-span-2  ' : 'order-2'}>
					<select
						bind:value={selectedLocale}
						on:change={handleLocaleChange}
						class="{$switchSideBar ? 'px-2.5 py-2' : 'px-2 py-1.5'} variant-filled-surface appearance-none rounded-full uppercase text-white"
					>
						{#each locales as locale}
							<option value={locale} selected={locale === $systemLanguage}>{locale}</option>
						{/each}
					</select>
				</div>

				<!-- light/dark mode switch -->
				<div class="{$switchSideBar ? 'order-2' : 'order-3'}  ">
					<button use:popup={SwitchThemeSettings} on:click={toggleTheme} class="btn-icon hover:bg-surface-500 hover:text-white">
						{#if !$modeCurrent}
							<iconify-icon icon="bi:sun" width="22" />
						{:else}
							<iconify-icon icon="bi:moon-fill" width="22" />
						{/if}

						<!-- TODO: tooltip overflow -->
					</button>

					<!-- Popup Tooltip with the arrow element -->
					<div class="card variant-filled-secondary p-2" data-popup="SwitchTheme">
						{`Switch to ${!$modeCurrent ? 'Light' : 'Dark'} Mode`}
						<div class="arrow variant-filled-secondary" />
					</div>
				</div>

				<!-- Lucia Sign Out -->
				<div class={$switchSideBar ? 'order-4' : 'order-4'}>
					<button use:popup={SignOutTooltip} on:click={signOut} type="submit" value="Sign out" class="btn-icon hover:bg-surface-500 hover:text-white"
						><iconify-icon icon="uil:signout" width="26" /></button
					>

					<div class="card variant-filled-secondary z-10 p-2" data-popup="SignOut">
						{$LL.SBL_SignOut()}
						<div class="arrow variant-filled-secondary" />
					</div>
				</div>

				<!-- Collection Builder -->
				<div class={$switchSideBar ? 'order-5' : 'order-6'}>
					<button class="btn-icon pt-1.5 hover:bg-surface-500 hover:text-white">
						<a use:popup={BuilderTooltip} {href}>
							<iconify-icon icon="material-symbols:build-circle" width="32" />
						</a>

						<div class="card variant-filled-secondary z-10 p-2" data-popup="Builder">
							Collection Builder
							<div class="arrow variant-filled-secondary" />
						</div>
					</button>
				</div>

				<!-- Github discussions -->
				<div class={$switchSideBar ? 'order-7' : 'order-7 hidden'}>
					<button class="btn-icon pt-1.5 hover:bg-surface-500 hover:text-white">
						<a href="https://github.com/Rar9/SimpleCMS/discussions" target="blank">
							<iconify-icon icon="grommet-icons:github" width="30" />
						</a>
					</button>
				</div>

				<!-- CMS Version -->
				<div class={$switchSideBar ? 'order-6' : 'order-5'}>
					<a href="https://github.com/Rar9/SimpleCMS/" target="blank">
						<span class="{$switchSideBar ? 'py-1' : 'py-0'} badge variant-filled-primary rounded-xl text-black hover:text-white"
							>{#if $switchSideBar}{$LL.SBL_Version()}{/if}{pkg}</span
						>
					</a>
				</div>
			</div>
		</div>
	</svelte:fragment>

	<svelte:fragment slot="sidebarRight">
		{#if $mode == 'edit' || $mode == 'create'}
			<ControlPanel />
		{/if}
	</svelte:fragment>

	<svelte:fragment slot="pageHeader">
		<div>pageHeader</div>

		{#if $mode == 'edit' || $mode == 'create'}
			mobile sidebar header
		{/if}
	</svelte:fragment>

	<!-- Router Slot -->
	<Toast />
	<slot />
	<!-- ---- / ---- -->

	<svelte:fragment slot="pageFooter">
		<div>pageFooter</div>

		{#if $mode == 'edit' || $mode == 'create'}
			mobile sidebar footer
		{/if}
	</svelte:fragment>
</AppShell>
