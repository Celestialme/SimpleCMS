<script lang="ts">
	import SignIn from './components/SignIn.svelte';
	import SignUp from './components/SignUp.svelte';
	import RoundLogo from './components/icons/RoundLogo.svelte';
	import type { PageData } from './$types';
	import DropDown from '@src/components/system/dropDown/DropDown.svelte';
	import { locales } from '@src/i18n/i18n-util';
	import { systemLanguage } from '@src/stores/load';
	export let data: PageData;
	console.log(data);
	let active: undefined | 0 | 1 = undefined;
	let background: 'white' | '#242728' = 'white';

	console.log(locales);
</script>

<div class="body" style="background:{background} ">
	<SignIn {active} on:click={() => (active = 0)} on:pointerenter={() => (background = '#242728')} />
	<SignUp {active} on:click={() => (active = 1)} on:pointerenter={() => (background = 'white')} />
	{#if active == undefined}
		<div class="z-30"><RoundLogo /></div>
	{/if}
	<div class="absolute top-[80%] left-1/2 -translate-x-1/2">
		<DropDown items={locales} bind:selected={$systemLanguage} />
	</div>
</div>

<style>
	.body {
		width: 100vw;
		height: 100vh;
		display: flex;
		overflow: hidden;
		background: linear-gradient(90deg, #242728 50%, white 50%);
	}
</style>
