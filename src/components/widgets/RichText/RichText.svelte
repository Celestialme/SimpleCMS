<script lang="ts">
	import { self } from 'svelte/legacy';
	import publicConfig from '@root/config/public';
	import Input from '@src/components/system/inputs/Input.svelte';
	import DropDown from './components/DropDown.svelte';
	import ColorSelector from './components/ColorSelector.svelte';
	import { onMount, onDestroy, tick, untrack } from 'svelte';
	import { Editor, Extension } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Link from '@tiptap/extension-link';
	import TextStyle from './extensions/TextStyle';
	import FontFamily from '@tiptap/extension-font-family';
	import Color from '@tiptap/extension-color';
	import Youtube from '@tiptap/extension-youtube';
	import TextAlign from '@tiptap/extension-text-align';
	import type { ComponentProps } from 'svelte';
	import ImageResize from './extensions/ImageResize';
	import FileInput from '@src/components/system/inputs/FileInput.svelte';
	import {
		meta_data,
		createRandomID,
		debounce,
		getFieldName,
		updateTranslationProgress
	} from '@src/utils/utils';
	import type { FieldType } from '.';
	import { contentLanguage } from '@src/stores/load';
	import ImageDescription from './components/ImageDescription.svelte';
	import VideoDialog from './components/VideoDialog.svelte';
	import { Transaction } from '@tiptap/pm/state';
	import { entryData, mode } from '@src/stores/store.svelte';

	let element = $state() as HTMLElement;
	let editor = $state() as () => Editor;
	let showImageDialog = $state(false);
	let showVideoDialog = $state(false);
	let images = $state({});
	let active_dropDown = $state('');
	interface Props {
		field: FieldType;
		value?: any;
		WidgetData?: any;
	}

	let {
		field,
		value = entryData.value[getFieldName(field)] || { content: {}, header: {} },
		WidgetData = $bindable()
	}: Props = $props();
	WidgetData = async () => ({ images, data: _data });
	let _data = $state(mode.value == 'create' ? { content: {}, header: {} } : value);
	let _language = $derived(
		field?.translated ? $contentLanguage : publicConfig.DEFAULT_CONTENT_LANGUAGE
	);
	// svelte-ignore state_referenced_locally
	let previous_language = _language;
	contentLanguage.subscribe(async (val) => {
		editor && editor().commands.setContent(_data.content[val] || '');
	});
	$effect(() => {
		untrack(() => {
			updateTranslationProgress(_data.content, field);
		});
		_data.content[_language];
	});
	let deb = debounce(200);
	onMount(() => {
		let _editor = new Editor({
			parseOptions: { preserveWhitespace: 'full' },
			element: element,
			extensions: [
				StarterKit,
				Link,
				TextStyle,
				FontFamily,
				Color,
				Youtube,
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

			onTransaction: async ({ transaction }) => {
				active_dropDown = '';
				if (previous_language == _language) {
					handleImageDeletes(transaction);
				}
				previous_language = _language;
				let _editor = editor();
				editor = () => _editor;
				deb(() => {
					let content = editor().getHTML();
					content == '<p></p>' && (content = '');
					_data.content[_language] = content;
				});
			}
		});
		// force re-render so `editor().isActive` works as expected
		editor = () => _editor;
		tick().then(() => {
			editor().commands.focus('start');
		});
	});
	function handleImageDeletes(transaction: Transaction) {
		const getImageIds = (fragment: Transaction['doc']['content']) => {
			let srcs = new Set<string>();
			let obj = new Map<string, { id: string; src: string }>();
			fragment.forEach((node) => {
				if (node.type.name === 'image') {
					srcs.add(node.attrs.storage_image);
					obj.set(node.attrs.id, { id: node.attrs.id, src: node.attrs.src });
				}
			});
			return { srcs, obj };
		};
		let current = getImageIds(transaction.doc.content);
		let previous = getImageIds(transaction.before.content);
		// Determine which images were deleted
		let deletedImageSrcs = [...previous.srcs].filter(
			(src) => src && !current.srcs.has(src)
		) as string[];
		for (let obj of previous.obj) {
			if (!current.obj.has(obj[0])) {
				images[obj[0]] && delete images[obj[0]];
			}
		}
		//for ctrl - Z
		// for (let obj of current.obj) {
		// 	if (!previous.obj.has(obj[0])) {
		// 		fetch(obj[1].src).then(async (res) => {
		// 			const blob = await res.blob();
		// 			images[obj[0]] = blob;
		// 		});
		// 	}
		// }

		if (deletedImageSrcs.length > 0) {
			meta_data.add('storage_images_remove', deletedImageSrcs);
		}
	}
	onDestroy(() => {
		if (editor()) {
			editor().destroy();
		}
	});
	let textTypes: ComponentProps<DropDown>['items'] = $derived.by(() => {
		editor;
		return [
			{
				name: 'paragraph',
				icon: 'icomoon-free:section',
				active: () => editor().isActive('paragraph'),
				onClick: () => editor().chain().focus().setParagraph().run()
			},
			{
				name: 'Heading',
				icon: 'ci:heading-h1',
				active: () => editor().isActive('heading', { level: 1 }),
				onClick: () => editor().chain().focus().toggleHeading({ level: 1 }).run()
			},
			{
				name: 'Heading',
				icon: 'ci:heading-h2',
				active: () => editor().isActive('heading', { level: 2 }),
				onClick: () => editor().chain().focus().toggleHeading({ level: 2 }).run()
			}
		];
	});
	let fonts: ComponentProps<DropDown>['items'] = $derived.by(() => {
		editor;
		return [
			{
				name: 'Arial',
				active: () => editor().isActive('textStyle', { fontFamily: 'Arial' }),
				onClick: () => editor().chain().focus().setFontFamily('Arial').run()
			},
			{
				name: 'Verdana',
				active: () => editor().isActive('textStyle', { fontFamily: 'Verdana' }),
				onClick: () => editor().chain().focus().setFontFamily('Verdana').run()
			},
			{
				name: 'Tahoma',
				active: () => editor().isActive('textStyle', { fontFamily: 'Tahoma' }),
				onClick: () => editor().chain().focus().setFontFamily('Tahoma').run()
			},

			{
				name: 'Times New Roman',
				active: () => editor().isActive('textStyle', { fontFamily: 'Times New Roman' }),
				onClick: () => editor().chain().focus().setFontFamily('Times New Roman').run()
			},
			{
				name: 'Georgia',
				active: () => editor().isActive('textStyle', { fontFamily: 'Georgia' }),
				onClick: () => editor().chain().focus().setFontFamily('Georgia').run()
			},
			{
				name: 'Garamond',
				active: () => editor().isActive('textStyle', { fontFamily: 'Garamond' }),
				onClick: () => editor().chain().focus().setFontFamily('Garamond').run()
			}
		];
	});
	let alignText: ComponentProps<DropDown>['items'] = $derived.by(() => {
		editor;
		return [
			{
				name: 'left',
				icon: 'fa6-solid:align-left',
				active: () => editor().isActive({ textAlign: 'left' }),
				onClick: () => editor().chain().focus().setTextAlign('left').run()
			},
			{
				name: 'right',
				icon: 'fa6-solid:align-right',
				active: () => editor().isActive({ textAlign: 'right' }),
				onClick: () => editor().commands.setTextAlign('right')
			},
			{
				name: 'center',
				icon: 'fa6-solid:align-center',
				active: () => editor().isActive({ textAlign: 'center' }),
				onClick: () => editor().chain().focus().setTextAlign('center').run()
			},
			{
				name: 'justify',
				icon: 'fa6-solid:align-justify',
				active: () => editor().isActive({ textAlign: 'justify' }),
				onClick: () => editor().chain().focus().setTextAlign('justify').run()
			}
		];
	});
	let inserts: ComponentProps<DropDown>['items'] = $derived.by(() => {
		editor;
		return [
			{
				name: 'image',
				icon: 'fa6-solid:image',
				onClick: () => {
					showImageDialog = true;
				},
				active: () => editor().isActive('image')
			},
			{
				name: 'video',
				icon: 'fa6-solid:video',
				onClick: () => {
					showVideoDialog = true;
				},
				active: () => editor().isActive('video')
			}
		];
	});
	let floats: ComponentProps<DropDown>['items'] = $derived.by(() => {
		editor;
		return [
			{
				name: 'wrap left',
				icon: 'teenyicons:align-left-solid',
				onClick: () => editor().chain().focus().setImageFloat('left').run(),
				active: () => false
			},
			{
				name: 'wrap right',
				icon: 'teenyicons:align-right-solid',
				onClick: () => editor().chain().focus().setImageFloat('right').run(),
				active: () => false
			},
			{
				name: 'unwrap',
				icon: 'mdi:filter-remove',
				onClick: () => editor().chain().focus().setImageFloat('unset').run(),
				active: () => false
			}
		];
	});

	let fontSize = $state(16);
	$effect(() => {
		editor &&
			(fontSize =
				editor().getAttributes('textStyle').fontSize ||
				window
					.getComputedStyle(
						window.getSelection()?.focusNode?.parentElement || (element as HTMLElement)
					)
					.fontSize.replace('px', ''));
	});
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
			| 'description'
	) => {
		if (editor()?.isActive('image')) {
			return ['float', 'align', 'description'].includes(button);
		}
		if (['description', 'float'].includes(button)) {
			return false;
		}
		return true;
	};
</script>

<Input
	type="text"
	bind:value={_data.header[_language]}
	placeholder="Title"
	inputClass="!w-full mt-2"
/>

<div class="editor">
	{#if editor}
		<div class="translate-x-0 z-10 w-full">
			<div class="buttons">
				<DropDown
					show={show('textType')}
					items={textTypes}
					label="Text"
					bind:active={active_dropDown}
					key="textType"
				/>
				<DropDown
					key="font"
					show={show('font')}
					items={fonts}
					icon="file-icons:font"
					label="Font"
					bind:active={active_dropDown}
				/>
				<ColorSelector
					key="color"
					bind:active={active_dropDown}
					show={show('color')}
					color={editor().getAttributes('textStyle').color || '#000000'}
					on:change={(e) => editor().chain().focus().setColor(e.detail).run()}
				/>

				<div class="flex items-center" class:hidden={!show('fontSize')}>
					<button
						aria-label="Decrease Font Size"
						onclick={() => {
							fontSize--;
							editor().chain().focus().setFontSize(fontSize).run();
						}}
					>
						<iconify-icon icon="ic:twotone-minus" width="20"></iconify-icon>
					</button>
					<input type="text" class="w-[30px] outline-none text-center" bind:value={fontSize} />
					<button
						aria-label="Increase Font Size"
						onclick={() => {
							fontSize++;
							editor().chain().focus().setFontSize(fontSize).run();
						}}
					>
						<iconify-icon icon="ph:plus-bold" width="20"></iconify-icon>
					</button>
				</div>
				<button
					aria-label="Bold"
					class:hidden={!show('bold')}
					onclick={() => editor().chain().focus().toggleBold().run()}
					class:active={editor().isActive('bold')}
				>
					<iconify-icon icon="bi:type-bold" width="20"></iconify-icon>
				</button>
				<button
					aria-label="Italic"
					class:hidden={!show('italic')}
					onclick={() => editor().chain().focus().toggleItalic().run()}
					class:active={editor().isActive('italic')}
				>
					<iconify-icon icon="lucide:italic" width="20"></iconify-icon>
				</button>
				<button
					aria-label="Strikethrough"
					class:hidden={!show('strike')}
					onclick={() => editor().chain().focus().toggleStrike().run()}
					class:active={editor().isActive('strike')}
				>
					<iconify-icon icon="majesticons:strike-through-line" width="20"></iconify-icon>
				</button>
				<button
					aria-label="Link"
					class:hidden={!show('link')}
					onclick={() => editor().chain().focus().toggleLink({ href: 'https://google.com' }).run()}
					class:active={editor().isActive('link')}
				>
					<iconify-icon icon="pajamas:link" width="20"></iconify-icon>
				</button>
				<DropDown
					key="align"
					show={show('align')}
					items={alignText}
					label="Align"
					bind:active={active_dropDown}
				/>
				<DropDown
					key="insert"
					show={show('insert')}
					items={inserts}
					icon="typcn:plus"
					label="Insert"
					bind:active={active_dropDown}
				/>
				<DropDown
					key="float"
					show={show('float')}
					items={floats}
					icon="grommet-icons:text-wrap"
					label="Text Wrap"
					bind:active={active_dropDown}
				/>
				<ImageDescription
					bind:active={active_dropDown}
					key="description"
					show={show('description')}
					value={editor().getAttributes('image').description}
					on:submit={(e) => {
						editor().chain().focus().setImageDescription(e.detail).run();
					}}
				/>
				<FileInput
					closeButton
					bind:show={showImageDialog}
					class="fixed bg-white top-0 left-1/2 -translate-x-1/2 z-10"
					on:change={(e) => {
						let data = e.detail;
						let url;
						if (data instanceof File) {
							url = URL.createObjectURL(data);
							let image_id = createRandomID().toString();
							images[image_id] = data;
							editor().chain().focus().setImage({ src: url, id: image_id }).run();
						} else {
							url = data.original.url;

							editor().chain().focus().setImage({ src: url, storage_image: data._id }).run();
						}
					}}
				/>
				<VideoDialog bind:show={showVideoDialog} editor={editor()} />
			</div>
		</div>
	{/if}
	<div
		onpointerdown={self(() => editor().commands.focus('end'))}
		class="text_Area RichText"
		bind:this={element}
	></div>
</div>

<style>
	@import 'RichText.css';
	.buttons {
		overflow-x: auto;

		display: flex;
		gap: 10px;
		box-shadow: 0px 3px 5px 0px #b0b0b0b3;
		width: 100%;

		align-items: center;
		padding: 10px;
		position: sticky;
		top: 0;
		z-index: 10;
		max-width: 100%;
	}
	.buttons::before,
	.buttons::after {
		content: '';
		margin: auto;
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
		max-height: calc(100vh - 200px);
	}
	:global(.ProseMirror-selectednode img) {
		box-shadow: 0px 0px 3px 2px #00ffff99;
	}
</style>
