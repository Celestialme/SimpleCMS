<script lang="ts">
	import '@src/stores/store';
	import SignIn from './components/SignIn.svelte';
	import SignUp from './components/SignUp.svelte';
	import RoundLogo from './components/icons/RoundLogo.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	console.log(data);
	let active: undefined | 0 | 1 = undefined;
	let background: 'white' | '#242728' = 'white';
</script>

<div class="body" style="background:{background} ">
	<SignIn
		{active}
		formSchema={data.loginForm}
		recoverFormSchema={data.recoverForm}
		on:click={() => (active = 0)}
		on:pointerenter={() => (background = '#242728')}
	/>
	<SignUp {active} formSchema={data.signUpForm} on:click={() => (active = 1)} on:pointerenter={() => (background = 'white')} />
	{#if active == undefined}
		<div class="z-30"><RoundLogo /></div>
	{/if}
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
