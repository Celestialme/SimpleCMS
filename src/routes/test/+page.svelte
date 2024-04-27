<script lang="ts">
	import DropDown from './DropDown.svelte';
	import ColorSelector from './ColorSelector.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { Editor, Extension } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Link from '@tiptap/extension-link';
	import TextStyle from './TextStyle';
	import FontFamily from '@tiptap/extension-font-family';
	import Color from '@tiptap/extension-color';
	import TextAlign from '@tiptap/extension-text-align';

	import type { ComponentProps } from 'svelte';
	let element;
	let editor: Editor;

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [
				StarterKit,
				Link,
				TextStyle,
				FontFamily,
				Color,
				TextAlign.configure({
					types: ['heading', 'paragraph']
				}),

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
		fontSize.default = parseInt(getComputedStyle(editor.view.dom).fontSize.replace('px', ''));
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});
	let textTypes: ComponentProps<DropDown>['items'];
	let fonts: ComponentProps<DropDown>['items'];
	let alignText: ComponentProps<DropDown>['items'];
	$: textTypes = [
		{
			name: 'paragraph',
			icon: 'icomoon-free:section',
			active: () => editor.isActive('paragraph'),
			onClick: () => editor.chain().focus().setParagraph().run()
		},
		{
			name: 'Heading',
			icon: 'ci:heading-h1',
			active: () => editor.isActive('heading', { level: 1 }),
			onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run()
		},
		{
			name: 'Heading',
			icon: 'ci:heading-h2',
			active: () => editor.isActive('heading', { level: 2 }),
			onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run()
		}
	];

	$: fonts = [
		{
			name: 'Arial',
			active: () => editor.isActive('textStyle', { fontFamily: 'Arial' }),
			onClick: () => editor.chain().focus().setFontFamily('Arial').run()
		},
		{
			name: 'Verdana',
			active: () => editor.isActive('textStyle', { fontFamily: 'Verdana' }),
			onClick: () => editor.chain().focus().setFontFamily('Verdana').run()
		},
		{
			name: 'Tahoma',
			active: () => editor.isActive('textStyle', { fontFamily: 'Tahoma' }),
			onClick: () => editor.chain().focus().setFontFamily('Tahoma').run()
		},

		{
			name: 'Times New Roman',
			active: () => editor.isActive('textStyle', { fontFamily: 'Times New Roman' }),
			onClick: () => editor.chain().focus().setFontFamily('Times New Roman').run()
		},
		{
			name: 'Georgia',
			active: () => editor.isActive('textStyle', { fontFamily: 'Georgia' }),
			onClick: () => editor.chain().focus().setFontFamily('Georgia').run()
		},
		{
			name: 'Garamond',
			active: () => editor.isActive('textStyle', { fontFamily: 'Garamond' }),
			onClick: () => editor.chain().focus().setFontFamily('Garamond').run()
		}
	];
	$: alignText = [
		{
			name: 'left',
			icon: 'fa6-solid:align-left',
			active: () => editor.isActive({ textAlign: 'left' }),
			onClick: () => editor.chain().focus().setTextAlign('left').run()
		},
		{
			name: 'right',
			icon: 'fa6-solid:align-right',
			active: () => editor.isActive({ textAlign: 'right' }),
			onClick: () => editor.commands.setTextAlign('right')
		},
		{
			name: 'center',
			icon: 'fa6-solid:align-center',
			active: () => editor.isActive({ textAlign: 'center' }),
			onClick: () => editor.chain().focus().setTextAlign('center').run()
		},
		{
			name: 'justify',
			icon: 'fa6-solid:align-justify',
			active: () => editor.isActive({ textAlign: 'justify' }),
			onClick: () => editor.chain().focus().setTextAlign('justify').run()
		}
	];
	let fontSize = {
		value: 0,
		default: 0
	};

	$: editor && (fontSize.value = editor.getAttributes('textStyle').fontSize || fontSize.default);
</script>

<div class="editor">
	{#if editor}
		<div class="buttons">
			<DropDown items={textTypes} />
			<DropDown items={fonts} icon="file-icons:font" label="Font" />
			<ColorSelector
				color={editor.getAttributes('textStyle').color || '#000000'}
				on:change={(e) => editor.chain().focus().setColor(e.detail).run()}
			/>

			<div class="flex items-center">
				<button
					on:click={() => {
						fontSize.value--;
						editor.chain().focus().setFontSize(fontSize.value).run();
					}}
				>
					<iconify-icon icon="ic:twotone-minus" width="20" />
				</button>
				<input type="text" class="w-[30px] outline-none text-center" bind:value={fontSize.value} />
				<button
					on:click={() => {
						fontSize.value++;
						editor.chain().focus().setFontSize(fontSize.value).run();
					}}
				>
					<iconify-icon icon="ph:plus-bold" width="20" />
				</button>
			</div>
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
			<DropDown items={alignText} label="Align" />
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
		position: sticky;
		top: 0;
		z-index: 10;
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
		overflow: auto;
		max-height: calc(100vh - 80px);
	}
</style>
