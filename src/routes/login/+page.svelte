<script lang="ts">
	import SignIn from './components/SignIn.svelte';
	import SignUp from './components/SignUp.svelte';
	import RoundLogo from './components/icons/RoundLogo.svelte';
	import DropDown from '@src/components/system/dropDown/DropDown.svelte';

	import { systemLanguage } from '@src/stores/load';
	import publicConfig from '@root/config/public';

	let active: undefined | 0 | 1 = $state(undefined);
	let background: 'white' | '#242728' = $state('white');
</script>

<div class="body" style="background:{background} ">
	<SignIn {active} onclick={() => (active = 0)} onpointerenter={() => (background = '#242728')} />
	<SignUp {active} onclick={() => (active = 1)} onpointerenter={() => (background = 'white')} />
	{#if active == undefined}
		<div class="z-30"><RoundLogo /></div>
	{/if}
	<div class="absolute top-[80%] left-1/2 -translate-x-1/2">
		<DropDown items={publicConfig.AVAILABLE_SYSTEM_LANGUAGES} bind:selected={$systemLanguage} />
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
