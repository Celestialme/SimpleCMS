<script lang="ts">
	import publicConfig from '@root/config/public';
	import Input from '@src/components/system/inputs/Input.svelte';
	import DropDown from './DropDown.svelte';
	import ColorSelector from './ColorSelector.svelte';
	import { onMount, onDestroy, tick } from 'svelte';
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
	import { entryData, mode } from '@src/stores/store';
	import {
		meta_data,
		createRandomID,
		debounce,
		getFieldName,
		updateTranslationProgress
	} from '@src/utils/utils';
	import type { FieldType } from '.';
	import { contentLanguage } from '@src/stores/load';
	export let field: FieldType;
	export const WidgetData = async () => ({ images, data: _data });
	let fieldName = getFieldName(field);
	let element;
	let editor: Editor;
	let showImageDialog = false;
	let images = {};
	export let value = $entryData[fieldName] || { content: {}, header: {} };
	let _data = $mode == 'create' ? { content: {}, header: {} } : value;
	$: _language = field?.translated ? $contentLanguage : publicConfig.DEFAULT_CONTENT_LANGUAGE;
	contentLanguage.subscribe(async (val) => {
		await tick();
		editor && editor.commands.setContent(_data.content[val] || '');
	});
	$: updateTranslationProgress(_data.content, field);
	let deb = debounce(500);
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
				Object.keys(_data.content).length > 0
					? _data.content[_language]
					: value.content[_language] || '',

			onTransaction: ({ transaction }) => {
				// force re-render so `editor.isActive` works as expected
				handleImageDeletes(transaction);
				editor = editor;
				deb(() => {
					let content = editor.getHTML();
					content == '<p></p>' && (content = '');
					_data.content[_language] = content;
				});
			}
		});
	});
	function handleImageDeletes(transaction) {
		const getImageIds = (fragment) => {
			let srcs = new Set();
			fragment.forEach((node) => {
				if (node.type.name === 'image') {
					srcs.add(node.attrs.media_image);
				}
			});
			return srcs;
		};

		let currentIds = getImageIds(transaction.doc.content);
		let previousIds = getImageIds(transaction.before.content);

		// Determine which images were deleted
		let deletedImageIds = [...previousIds].filter((id) => !currentIds.has(id)) as string[];

		if (deletedImageIds.length > 0) {
			meta_data.add('media_images_remove', deletedImageIds);
		}
	}
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
			onClick: () => editor.chain().focus().setImageFloat('left').run(),
			active: () => false
		},
		{
			name: 'wrap right',
			icon: 'teenyicons:align-right-solid',
			onClick: () => editor.chain().focus().setImageFloat('right').run(),
			active: () => false
		},
		{
			name: 'unwrap',
			icon: 'mdi:filter-remove',
			onClick: () => editor.chain().focus().setImageFloat('unset').run(),
			active: () => false
		}
	];
	let fontSize = 16;
	$: editor &&
		(fontSize =
			editor.getAttributes('textStyle').fontSize ||
			window
				.getComputedStyle(
					window.getSelection()?.focusNode?.parentElement || (element as HTMLElement)
				)
				.fontSize.replace('px', ''));
	let show = (
		button:
			| 'textType'
			| 'font'
			| 'align'
			| 'insert'
			| 'float'
			| 'color'
			| 'bold'
			| 'italic'
			| 'strike'
			| 'link'
			| 'fontSize'
	) => {
		if (
			[
				'textType',
				'font',
				'insert',
				'color',
				'bold',
				'italic',
				'strike',
				'link',
				'fontSize'
			].includes(button)
		) {
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

<Input
	type="text"
	bind:value={_data.header[_language]}
	placeholder="Title"
	inputClass="!w-full mt-2"
/>
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
						fontSize--;
						editor.chain().focus().setFontSize(fontSize).run();
					}}
				>
					<iconify-icon icon="ic:twotone-minus" width="20" />
				</button>
				<input type="text" class="w-[30px] outline-none text-center" bind:value={fontSize} />
				<button
					on:click={() => {
						fontSize++;
						editor.chain().focus().setFontSize(fontSize).run();
					}}
				>
					<iconify-icon icon="ph:plus-bold" width="20" />
				</button>
			</div>
			<button
				class:hidden={!show('bold')}
				on:click={() => editor.chain().focus().toggleBold().run()}
				class:active={editor.isActive('bold')}
			>
				<iconify-icon icon="bi:type-bold" width="20" />
			</button>
			<button
				class:hidden={!show('italic')}
				on:click={() => editor.chain().focus().toggleItalic().run()}
				class:active={editor.isActive('italic')}
			>
				<iconify-icon icon="lucide:italic" width="20" />
			</button>
			<button
				class:hidden={!show('strike')}
				on:click={() => editor.chain().focus().toggleStrike().run()}
				class:active={editor.isActive('strike')}
			>
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
			<DropDown
				show={show('float')}
				items={floats}
				icon="grommet-icons:text-wrap"
				label="Text Wrap"
			/>
			<FileInput
				bind:show={showImageDialog}
				class="absolute bg-white top-0 z-10"
				on:change={(e) => {
					let data = e.detail;
					let url;
					if (data instanceof File) {
						url = URL.createObjectURL(data);
						let image_id = createRandomID().toString();
						images[image_id] = data;
						editor.chain().focus().setImage({ src: url, id: image_id }).run();
					} else {
						url = data.original.url;

						editor.chain().focus().setImage({ src: url, media_image: data._id }).run();
					}
				}}
			/>
		</div>
	{/if}
	<div
		on:pointerdown|self={() => editor.commands.focus('end')}
		class="text_Area RichText"
		bind:this={element}
	/>
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
		max-width: 100%;
		width: 100vw;
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
