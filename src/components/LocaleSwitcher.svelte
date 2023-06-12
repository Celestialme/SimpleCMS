<script lang="ts">
	import { browser } from '$app/environment';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { setLocale, locale } from '@src/i18n/i18n-svelte';
	import type { Locales } from '@src/i18n/i18n-types';
	import { locales } from '@src/i18n/i18n-util';
	import { loadLocaleAsync } from '@src/i18n/i18n-util.async';
	import { replaceLocaleInUrl } from '@src/utils/utils';

	const switchLocale = async (newLocale: Locales, updateHistoryState = true) => {
		if (!newLocale || $locale === newLocale) return;

		// load new dictionary from server
		await loadLocaleAsync(newLocale);

		// select locale
		setLocale(newLocale);

		// update `lang` attribute
		document.querySelector('html').setAttribute('lang', newLocale);

		if (updateHistoryState) {
			// update url to reflect locale changes
			history.pushState({ locale: newLocale }, '', replaceLocaleInUrl($page.url, newLocale));
		}

		// run the `load` function again
		invalidateAll();
	};

	// update locale when navigating via browser back/forward buttons
	const handlePopStateEvent = async ({ state }: PopStateEvent) => switchLocale(state.locale, false);

	// update locale when page store changes
	$: if (browser) {
		const lang = $page.params.lang as Locales;
		switchLocale(lang, false);
		history.replaceState({ ...history.state, locale: lang }, '', replaceLocaleInUrl($page.url, lang));
	}

	let showAutocomplete = false;
	let showDropdown = false;
	let input: string = '';
	let filteredLocales = locales;

	if (locales.length > 4) {
		showAutocomplete = true;
	}

	function handleInput(event) {
		const value = event.target.value.toLowerCase();
		filteredLocales = locales.filter((l) => l.toLowerCase().includes(value));
	}

	let isLoginPage = false;
	$: {
		const pathParts = $page.url.pathname.split('/');
		const lang = pathParts[1];
		const pageName = lang === 'en' ? pathParts[1] : pathParts[2];
		isLoginPage = pageName === 'login';
	}
</script>

<svelte:window on:popstate={handlePopStateEvent} />

<!-- TODO: MODIFY for Sidebarleft -->
<!-- search autocomplete dropdown if more than 3 languages -->
{#if showAutocomplete}
	<div class="relative">
		<input
			class="rounded-full bg-gray-800 uppercase text-white focus:ring-2 focus:ring-blue-500 active:ring-2 active:ring-blue-300"
			placeholder={$locale}
			on:input={handleInput}
			bind:value={input}
			disabled
		/>
		{#if showDropdown}
			<div class="absolute z-10 rounded-md bg-white shadow-lg">
				{#each filteredLocales as l}
					<div
					          	class="cursor-pointer px-4 py-2 uppercase hover:bg-gray-100"
					on:keydown	on:click={() => {
					          		switchLocale(l);
					          		input = '';
					          	}}
					>
						{l}
					</div>
				{/each}
			</div>
		{/if}
	</div>
{:else}
	<select
		class="rounded-full border-2 border-white bg-gray-800 uppercase text-white focus:ring-2 focus:ring-blue-500 active:ring-2 active:ring-blue-300"
		value={$locale}
		on:change={(e) => switchLocale(e.currentTarget.value)}
	>
		<option value={$locale} disabled>{$locale}</option>
		{#each locales.filter((l) => l !== $locale) as l}
			<option value={l}>{l}</option>
		{/each}
	</select>
{/if}
