<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor, Extension } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Link from '@tiptap/extension-link';
	let element;
	let editor: Editor;

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [
				StarterKit,
				Link,
				Extension.create({
					name: 'Tab',
					addKeyboardShortcuts() {
						return {
							Tab: () => {
								return this.editor.commands.insertContent('\t');
							}
						};
					}
				})
			],

			content: '<p>Hello World! 🌍️ </p>',
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			}
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});
</script>

<div class="editor">
	{#if editor}
		<div class="buttons">
			<button on:click={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} class:active={editor.isActive('heading', { level: 1 })}>
				<iconify-icon icon="ci:heading-h1" width="20"></iconify-icon>
			</button>
			<button on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} class:active={editor.isActive('heading', { level: 2 })}>
				<iconify-icon icon="ci:heading-h2" width="20"></iconify-icon>
			</button>
			<button on:click={() => editor.chain().focus().setParagraph().run()} class:active={editor.isActive('paragraph')}>
				<iconify-icon icon="icomoon-free:section" width="20" />
			</button>
			<button on:click={() => editor.chain().focus().toggleBold().run()} class:active={editor.isActive('bold')}>
				<iconify-icon icon="bi:type-bold" width="20" />
			</button>
			<button on:click={() => editor.chain().focus().toggleItalic().run()} class:active={editor.isActive('italic')}>
				<iconify-icon icon="lucide:italic" width="20" />
			</button>
			<button on:click={() => editor.chain().focus().toggleStrike().run()} class:active={editor.isActive('strike')}>
				<iconify-icon icon="majesticons:strike-through-line" width="20" />
			</button>
			<button on:click={() => editor.chain().focus().toggleLink({ href: 'https://google.com' }).run()} class:active={editor.isActive('link')}>
				<iconify-icon icon="pajamas:link" width="20" />
			</button>
		</div>
	{/if}
	<div on:pointerdown|self={() => editor.commands.focus('end')} class="text_Area RichText" bind:this={element} />
</div>

<style>
	@import 'RichText.css';
	.buttons {
		display: flex;
		gap: 10px;
		box-shadow: 0px 3px 5px 0px #b0b0b0b3;
		width: 100%;
		justify-content: center;
		align-items: center;
		padding: 10px;
	}
	button {
		height: 20px;
	}
	button.active {
		color: aqua;
	}
	:global(.tiptap) {
		outline: none;
	}
	.editor {
		display: flex;
		max-width: 600px;
		margin: auto;
		flex-direction: column;
		gap: 10px;
		align-items: center;
		box-shadow: 4px 4px 16px 1px #b0b0b0b3;
		border-radius: 8px;
		min-height: 600px;
	}
	.text_Area {
		width: 100%;
		flex-grow: 1;
		padding: 10px;
		cursor: text;
	}
</style>
