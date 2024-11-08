<script lang="ts">
	import Button from '@src/components/system/buttons/Button.svelte';
	import XIcon from '@src/components/system/icons/XIcon.svelte';
	import FloatingInput from '@src/components/system/inputs/FloatingInput.svelte';
	import type { Editor } from '@tiptap/core';

	interface Props {
		show?: boolean;
		editor: Editor;
	}

	let { show = $bindable(false), editor }: Props = $props();
	let insert_url = $state(false);
	let youtube_url = $state('');
	function addVideo() {
		editor.chain().focus().setYoutubeVideo({ src: youtube_url }).run();
		youtube_url = '';
		show = false;
		insert_url = false;
	}
	function close() {
		youtube_url = '';
		show = false;
		insert_url = false;
	}
</script>

{#if show}
	<div class="fixed bg-white top-0 left-1/2 -translate-x-1/2 z-10">
		<XIcon class="absolute right-2 top-4 cursor-pointer z-10" on:click={close} />
		{#if insert_url}
			<div
				class="px-[50px] w-[500px] max-w-full h-[200px] mt-2 border-2 border-dashed border-[#c1c1c1] flex flex-col items-center justify-center gap-4 select-none relative"
			>
				<FloatingInput
					bind:value={youtube_url}
					theme="light"
					name="Youtube URL"
					label="Youtube URL"
				/>
				<Button on:click={addVideo}>Add Video</Button>
			</div>
		{:else}
			<div
				class="w-[500px] max-w-full h-[200px] mt-2 border-2 border-dashed border-[#c1c1c1] flex flex-col items-center justify-center gap-4 select-none relative"
			>
				<p>Drag & Drop</p>
				<p>or</p>
				<div class="flex w-full gap-2 justify-center">
					<Button style="flex: 1 1 0px; max-width:150px">Browse locally</Button>
					<Button style="flex: 1 1 0px; max-width:150px" on:click={() => (insert_url = true)}
						>YouTube</Button
					>
				</div>
			</div>
		{/if}
	</div>
{/if}
