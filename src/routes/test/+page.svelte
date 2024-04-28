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
	import ImageResize from './ImageResize';
	import FileInput from '@src/components/system/inputs/FileInput.svelte';
	let element;
	let editor: Editor;
	let showImageDialog = false;
	$: globalThis.editor = editor;
	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [
				StarterKit,
				Link,
				TextStyle,
				FontFamily,
				Color,
				ImageResize,
				TextAlign.configure({
					types: ['heading', 'paragraph', 'image']
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

			content:
				'<p></p><div style="float: left;width: 428px;height: 412px; margin-left: 24.9206%"><img src="/media/images/images/thumbnail/b5d7c58714cc3a7c709f.avif" style="width: 100%; height: 100%; cursor:pointer"></div><p><span style="font-size: 21px">Hello World! 🌍️</span></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><div style="float: right;width: 320px;height: 320px; margin-left: undefined"><img src="/media/images/images/thumbnail/9bb29405081821541a46.avif" style="width: 100%; height: 100%; cursor:pointer"></div>',
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
	let inserts: ComponentProps<DropDown>['items'];

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
	$: inserts = [
		{
			name: 'image',
			icon: 'fa6-solid:image',
			onClick: () => {
				showImageDialog = true;
			},
			active: () => editor.isActive('image')
		}
	];
	$: floats = [
		{
			name: 'wrap left',
			icon: 'teenyicons:align-left-solid',
			onClick: () => editor.chain().focus().float('left').run(),
			active: () => false
		},
		{
			name: 'wrap right',
			icon: 'teenyicons:align-right-solid',
			onClick: () => editor.chain().focus().float('right').run(),
			active: () => false
		},
		{
			name: 'unwrap',
			icon: 'mdi:filter-remove',
			onClick: () => editor.chain().focus().float('unset').run(),
			active: () => false
		}
	];
	let fontSize = {
		value: 0,
		default: 0
	};
	$: editor && (fontSize.value = editor.getAttributes('textStyle').fontSize || fontSize.default);

	let show = (button: 'textType' | 'font' | 'align' | 'insert' | 'float' | 'color' | 'bold' | 'italic' | 'strike' | 'link' | 'fontSize') => {
		if (['textType', 'font', 'insert', 'color', 'bold', 'italic', 'strike', 'link', 'fontSize'].includes(button)) {
			return !editor?.isActive('image');
		}
		if (['float'].includes(button)) {
			return editor?.isActive('image');
		}
		return true;
	};
	$: {
		show = show;
		editor;
	}
</script>

<div class="editor">
	{#if editor}
		<div class="buttons">
			<DropDown show={show('textType')} items={textTypes} label="Text" />
			<DropDown show={show('font')} items={fonts} icon="file-icons:font" label="Font" />
			<ColorSelector
				show={show('color')}
				color={editor.getAttributes('textStyle').color || '#000000'}
				on:change={(e) => editor.chain().focus().setColor(e.detail).run()}
			/>

			<div class="flex items-center" class:hidden={!show('fontSize')}>
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
			<button class:hidden={!show('bold')} on:click={() => editor.chain().focus().toggleBold().run()} class:active={editor.isActive('bold')}>
				<iconify-icon icon="bi:type-bold" width="20" />
			</button>
			<button class:hidden={!show('italic')} on:click={() => editor.chain().focus().toggleItalic().run()} class:active={editor.isActive('italic')}>
				<iconify-icon icon="lucide:italic" width="20" />
			</button>
			<button class:hidden={!show('strike')} on:click={() => editor.chain().focus().toggleStrike().run()} class:active={editor.isActive('strike')}>
				<iconify-icon icon="majesticons:strike-through-line" width="20" />
			</button>
			<button
				class:hidden={!show('link')}
				on:click={() => editor.chain().focus().toggleLink({ href: 'https://google.com' }).run()}
				class:active={editor.isActive('link')}
			>
				<iconify-icon icon="pajamas:link" width="20" />
			</button>
			<DropDown show={show('align')} items={alignText} label="Align" />
			<DropDown show={show('insert')} items={inserts} icon="typcn:plus" label="Insert" />
			<DropDown show={show('float')} items={floats} icon="grommet-icons:text-wrap" label="Text Wrap" />
			<FileInput
				bind:show={showImageDialog}
				class="absolute bg-white top-0 z-10"
				on:change={(e) => {
					let data = e.detail;
					let url;
					if (data instanceof File) {
						url = URL.createObjectURL(data);
					} else {
						url = data.thumbnail.url;
					}
					editor.chain().focus().setImage({ src: url }).run();
				}}
			/>
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
	:global(.ProseMirror-selectednode img) {
		box-shadow: 0px 0px 4px 0px #00ffff99 inset;
	}
</style>
