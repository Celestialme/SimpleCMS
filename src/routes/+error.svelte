<script lang="ts">
	import { page } from '$app/stores';
	import SimpleCmsLogo from '@src/components/icons/SimpleCMS_Logo.svelte';

	// typesafe-i18n
	import LL from '../i18n/i18n-svelte';
</script>

{#if $page}
	<main
		class="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-t from-surface-900 via-surface-700 to-surface-900"
	>
		<SimpleCmsLogo fill="red" className="h-20" />
		<h1 class=" mb-4 text-9xl font-extrabold tracking-widest text-white">{$page.status}</h1>
		<div class="absolute rotate-12 rounded bg-error-600 px-2 text-sm text-white">
			{$page.url}
			{$LL.ERROR_Pagenotfound()}
		</div>

		<h1 class="text-5xl font-extrabold tracking-widest text-white">
			{#if $page.error} {$page.error.message} {/if}
		</h1>

		<p class="text-lg text-white">{$LL.ERROR_Wrong()}</p>
		<a
			href="/"
			data-sveltekit-preload-data="tap"
			class="relative mt-5 block rounded-xl bg-gradient-to-br from-error-700 via-error-600 to-error-700 px-8 py-4 font-bold uppercase !text-white shadow-xl"
			>{$LL.ERROR_GoHome()}</a
		>
	</main>
{/if}
