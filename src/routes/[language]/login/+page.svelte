<script lang="ts">
	import '@src/stores/store';
	import { PUBLIC_SITENAME } from '$env/static/public';
	import SignIn from './components/SignIn.svelte';
	import SignUp from './components/SignUp.svelte';
	import Logo from './components/icons/Logo.svelte';
	import LocaleSwitcher from '@src/components/LocaleSwitcher.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	console.log('PageData', data);

	import { locale } from '@src/i18n/i18n-svelte';
	import { locales } from '@src/i18n/i18n-util';
	import { replaceLocaleInUrl } from '@src/utils/utils';
	//console.log('locales', locales);
	let selectedLocale = $locale;

	// todo: disable for Systemlanguage
	function handleLocaleChange(e) {
		selectedLocale = e.target.value;
		const newUrl = replaceLocaleInUrl(new URL(window.location.href), selectedLocale);
		window.location.href = newUrl;
	}

	let active: undefined | 0 | 1 = undefined;
	let background: 'white' | '#242728' = 'white';
</script>

<div class="body" style="background:{background} ">
	<SignIn
		{active}
		FormSchemaLogin={data.loginForm}
		FormSchemaForgot={data.forgotForm}
		FormSchemaReset={data.resetForm}
		on:click={() => (active = 0)}
		on:pointerenter={() => (background = '#242728')}
	/>

	<SignUp
		{active}
		FormSchemaSignUp={data.signUpForm}
		FormSchemaSignUpOther={data.signUpFormOther}
		firstUserExists={data.firstUserExists}
		on:click={() => (active = 1)}
		on:pointerenter={() => (background = 'white')}
	/>
	{#if active == undefined}
		<!-- CSS Logo -->
		<div class="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 transform items-center justify-center">
			<div class="relative top-[-150px] h-[170px] w-[170px] justify-center rounded-full bg-white">
				<svg width="160" height="160" class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
					<circle
						cx="80"
						cy="80"
						r="75"
						stroke-width="2"
						stroke-dasharray="191 191"
						stroke-dashoffset="191"
						transform="rotate(51.5, 80, 80)"
						class="fill-none stroke-red-500"
					/>

					<circle
						cx="80"
						cy="80"
						r="75"
						stroke-width="2"
						stroke-dasharray="191 191"
						stroke-dashoffset="191"
						transform="rotate(231.5, 80, 80)"
						class="fill-none stroke-red-500"
					/>
				</svg>

				<svg width="170" height="170" class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
					<circle
						cx="85"
						cy="85"
						r="80"
						stroke-width="2"
						stroke-dasharray="205 205"
						stroke-dashoffset="205"
						transform="rotate(50, 85, 85)"
						class="fill-none stroke-black"
					/>
					<circle
						cx="85"
						cy="85"
						r="80"
						stroke-width="2"
						stroke-dasharray="205 205"
						stroke-dashoffset="205"
						transform="rotate(230, 85, 85)"
						class="fill-none stroke-black"
					/>
				</svg>

				<div class="absolute left-1/2 top-[77px] flex -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center text-center">
					<Logo fill="black" className="w-8 h-8" />
					<div class="text-3xl font-bold text-error-500">{PUBLIC_SITENAME}</div>
					<div class="-mt-[1px] text-[11px] font-bold text-black">with Sveltekit Power</div>
				</div>
			</div>
		</div>
		<!-- TODO:fix Language switcher -->
		<div
			class="absolute bottom-1/4 left-1/2 flex -translate-x-1/2 -translate-y-1/2 transform cursor-pointer items-center justify-center rounded-full dark:text-black"
		>
			<select
				class="rounded-full border-2 border-white bg-[#242728] uppercase text-white focus:ring-2 focus:ring-blue-500 active:ring active:ring-blue-300"
				bind:value={selectedLocale}
				on:change={handleLocaleChange}
			>
				<option value={$locale} selected>{$locale}</option>
				{#each locales.filter((l) => l !== $locale) as l}
					<option value={l}>{l}</option>
				{/each}
			</select>
			<!-- <LocaleSwitcher /> -->
		</div>
	{/if}
</div>

<style lang="postcss">
	.body {
		width: 100vw;
		height: 100vh;
		display: flex;
		overflow: hidden;
		background: linear-gradient(90deg, #242728 50%, white 50%);
	}
</style>
