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
	export let closeButton = false;
	let ev = createEventDispatcher();
	let input: HTMLInputElement;
	let showMedia = false;
	let mediaOnSelect = (data: ImageFiles) => {
		show = false;
		showMedia = false;
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
	{#if !showMedia}
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
				'w-[500px] max-w-full h-[200px] mt-2 border-2 border-dashed border-[#c1c1c1] flex flex-col items-center justify-center gap-4 select-none relative',
				$$props.class
			)}
		>
			{#if closeButton}
				<XIcon class="absolute right-2 top-2 cursor-pointer" on:click={() => (show = false)} />
			{/if}
			<p>Drag & Drop</p>
			<p>or</p>
			<div class="flex w-full gap-2 justify-center">
				<Button style="flex: 1 1 0px; max-width:150px" on:click={() => input.click()}
					>Browse locally</Button
				>
				<Button style="flex: 1 1 0px; max-width:150px" on:click={() => (showMedia = true)}
					>Select Existing</Button
				>
			</div>
			<input bind:this={input} type="file" hidden on:change={onChange} />
		</div>
	{:else}
		<div
			class={twMerge(
				'flex flex-col rounded-md p-2 min-w-full max-w-full bg-white dashed',
				$$props.class
			)}
		>
			<button on:click={() => (showMedia = false)} class="ml-auto cursor-pointer">
				<XIcon />
			</button>
			<Media bind:onselect={mediaOnSelect} />
		</div>
	{/if}
{/if}

<style>
	.dashed {
		border: 1px dashed #00000047;
	}
</style>
