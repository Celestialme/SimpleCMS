<script lang="ts">
	import { collection, saveFunction } from '@src/stores/load';
	import Button from './system/buttons/Button.svelte';
	import { collectionValue, mode } from '@src/stores/store';
	import { saveFormData } from '@src/utils/utils';
	import { page } from '$app/stores';
	import type { User } from '@src/auth/types';
	let _saveFunction;
	_saveFunction = $saveFunction.fn = async () => {
		console.log($collectionValue);
		await saveFormData({ data: $collectionValue });
		mode.set('view');
	};
	$saveFunction.reset = () => {
		$saveFunction.fn = _saveFunction;
	};
	let user: User = $page.data.user;
</script>

<div class="wrapper max-md:absolute max-md:top-[calc(100%-45px)] max-md:!h-auto max-md:!w-screen max-md:!max-w-full">
	{#if $collection.permissions?.[user.role]?.write != false}
		<Button on:click={$saveFunction.fn}>SAVE</Button>
	{/if}
</div>

<style>
	.wrapper {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		flex-direction: column;
		max-width: 200px;
		height: 100vh;
		background-color: #242734;
		flex-shrink: 2;
		flex-grow: 1;
		width: 30vw;
		margin-top: auto;
	}
</style>
