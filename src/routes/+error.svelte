<script lang="ts">
	import { page } from '$app/stores';
	import SimpleCmsLogo from '@src/components/icons/SimpleCMS_Logo.svelte';
</script>

{#if $page}
	<main class="h-screen w-full flex flex-col justify-center items-center bg-gray-800">
		<SimpleCmsLogo fill="red" className="h-20"  /> 
		<h1 class=" text-9xl font-extrabold text-white tracking-widest mb-4">{$page.status}</h1>
		<div class="bg-red-600 px-2 text-sm rounded rotate-12 absolute text-white">
			{$page.url} Page Not Found
		</div>
		
		<h1 class="text-5xl font-extrabold text-white tracking-widest">{#if $page.error} {$page.error.message} {/if}</h1>
		
		<p class="text-white text-lg">We're sorry, something went wrong. </p>
		<a
          href="/"
          data-sveltekit-preload-data="tap" class="relative block mt-5 px-8 py-4 uppercase shadow-xl text-white font-bold bg-gradient-to-br from-red-700 via-red-600 to-red-700 rounded-xl"
          >Go Home</a
        >
		
	</main>
{/if}