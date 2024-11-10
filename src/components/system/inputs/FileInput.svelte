<script lang="ts">
	import Button from '../buttons/Button.svelte';
	import XIcon from '../icons/XIcon.svelte';
	import Media from '@src/components/Media.svelte';
	import type { ImageFile } from '@src/utils/files';
	import { twMerge } from 'tailwind-merge';
	interface Props {
		value?: File | ImageFile | undefined;
		show?: boolean;
		closeButton?: boolean;
		onchange?: (value: File | ImageFile) => void;
		class?: string;
	}

	let {
		value = $bindable(undefined),
		show = $bindable(true),
		closeButton = false,
		onchange,
		class: _class
	}: Props = $props();
	let input = $state() as HTMLInputElement;
	let showMedia = $state(false);
	let mediaOnSelect = (data: ImageFile) => {
		show = false;
		showMedia = false;
		value = data;
		onchange?.(value);
	};
	let _onChange = () => {
		if (input.files?.length == 0) return;
		value = input.files?.[0] as File;
		show = false;
		onchange?.(value);
	};
</script>

{#if show}
	{#if !showMedia}
		<div
			ondrop={(e) => {
				e.preventDefault();
				value = e?.dataTransfer?.files[0];
				show = false;
				value && onchange?.(value);
			}}
			ondragover={(e) => {
				e.preventDefault();
				(e.target as any).style.borderColor = '#6bdfff';
			}}
			ondragleave={(e) => {
				e.preventDefault();
				(e.target as any).style.removeProperty('border-color');
			}}
			class={twMerge(
				'w-[500px] max-w-full h-[200px] mt-2 border-2 border-dashed border-[#c1c1c1] flex flex-col items-center justify-center gap-4 select-none relative',
				_class
			)}
		>
			{#if closeButton}
				<XIcon class="absolute right-2 top-2 cursor-pointer" on:click={() => (show = false)} />
			{/if}
			<p>Drag & Drop</p>
			<p>or</p>
			<div class="flex w-full gap-2 justify-center">
				<Button style="flex: 1 1 0px; max-width:150px" onclick={() => input.click()}
					>Browse locally</Button
				>
				<Button style="flex: 1 1 0px; max-width:150px" onclick={() => (showMedia = true)}
					>Select Existing</Button
				>
			</div>
			<input bind:this={input} type="file" hidden onchange={_onChange} />
		</div>
	{:else}
		<div
			class={twMerge('flex flex-col rounded-md p-2 min-w-full max-w-full bg-white dashed', _class)}
		>
			<button onclick={() => (showMedia = false)} class="ml-auto cursor-pointer">
				<XIcon />
			</button>
			<Media onselect={mediaOnSelect} />
		</div>
	{/if}
{/if}

<style>
	.dashed {
		border: 1px dashed #00000047;
	}
</style>
