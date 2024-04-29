<script lang="ts">
	import { asAny } from '@src/utils/utils';
	import Button from '../buttons/Button.svelte';
	import XIcon from '../icons/XIcon.svelte';
	import Media from '@src/components/Media.svelte';
	import type { ImageFiles } from '@src/utils/types';
	import { twMerge } from 'tailwind-merge';
	import { createEventDispatcher } from 'svelte';
	export let value: File | ImageFiles | undefined = undefined;
	export let show = true;
	let ev = createEventDispatcher();
	let input: HTMLInputElement;
	let showMedia = false;
	let mediaOnSelect = (data: ImageFiles) => {
		show = false;
		value = data;
		ev('change', value);
	};
	let onChange = () => {
		if (input.files?.length == 0) return;
		value = input.files?.[0] as File;
		show = false;
		ev('change', value);
	};
</script>

{#if show}
	<div
		on:drop|preventDefault={(e) => {
			value = e?.dataTransfer?.files[0];
		}}
		on:dragover|preventDefault={(e) => {
			asAny(e.target).style.borderColor = '#6bdfff';
		}}
		on:dragleave|preventDefault={(e) => {
			asAny(e.target).style.removeProperty('border-color');
		}}
		class={twMerge(
			'w-[500px] max-w-full h-[200px] mt-2 border-2 border-dashed border-[#c1c1c1] flex flex-col items-center justify-center gap-4 select-none',
			$$props.class
		)}
	>
		<p>Drag & Drop</p>
		<p>or</p>
		<div class="flex w-full gap-2 justify-center">
			<Button style="flex: 1 1 0px;" on:click={() => input.click()}>Browse locally</Button>
			<Button style="flex: 1 1 0px;" on:click={() => (showMedia = true)}>Select Existing</Button>
		</div>
		<input bind:this={input} type="file" hidden on:change={onChange} />
	</div>

	{#if showMedia}
		<div class="flex flex-col rounded-md p-2 fixed left-[50%] top-[50%] w-[90%] h-[80%] translate-y-[-50%] translate-x-[-50%] z-[999999999] bg-white">
			<button on:click={() => (showMedia = false)} class="ml-auto cursor-pointer">
				<XIcon />
			</button>
			<Media bind:onselect={mediaOnSelect} />
		</div>
	{/if}
{/if}
