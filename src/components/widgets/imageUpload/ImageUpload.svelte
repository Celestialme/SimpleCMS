<script lang="ts">
	import axios from 'axios';
	import type { FieldType } from '.';
	import { entryData, mode } from '@src/stores/store';
	import { asAny, getFieldName } from '@src/utils/utils';
	import Button from '@src/components/system/buttons/Button.svelte';
	import type { Layer } from 'konva/lib/Layer';
	import type { Transformer } from 'konva/lib/shapes/Transformer';
	import XIcon from '@src/components/system/icons/XIcon.svelte';
	import type { Group } from 'konva/lib/Group';
	import Media from '@src/components/Media.svelte';
	import type { ImageFiles } from '@src/utils/types';
	import type { Stage } from 'konva/lib/Stage';
	export let field: FieldType;
	let _data: File | ImageFiles | undefined;
	let updated = false;
	let input: HTMLInputElement;
	let showMedia = false;

	export const WidgetData = async () => {
		if (_data && _data instanceof File) {
			_data.path = field.path;
		}

		return updated ? _data : null;
		// return null;
	};
	export let value: File | ImageFiles = $entryData[getFieldName(field)]; // pass file directly from imageArray

	let fieldName = getFieldName(field);
	function setFile(node: HTMLInputElement) {
		node.onchange = (e) => {
			if ((e.target as HTMLInputElement).files?.length == 0) return;
			updated = true;
			_data = (e.target as HTMLInputElement).files?.[0] as File;
		};

		if (value instanceof File) {
			let fileList = new DataTransfer();
			fileList.items.add(value);
			node.files = fileList.files;
			_data = node.files[0];
			updated = true;
		} else if ($mode === 'edit' && value?.thumbnail) {
			axios.get(value.thumbnail.url, { responseType: 'blob' }).then(({ data }) => {
				if (value instanceof File) return;
				let fileList = new DataTransfer();
				let file = new File([data], value.thumbnail.name, {
					type: value.thumbnail.type
				});
				fileList.items.add(file);
				node.files = fileList.files;
				_data = node.files[0];
			});
		}
	}
	let editing = false;
	let edit = {
		stage: {} as Stage,
		group: {} as Group,
		transformers: [] as Transformer[],
		async startEdit() {
			editing = true;
			let image = new Image();
			if (_data && updated) {
				if (_data instanceof File) {
					image.src = URL.createObjectURL(_data as File);
				} else {
					image.src = '/media/' + _data.original.url;
				}
			} else {
				image.src = '/media/' + (value as ImageFiles).original.url;
			}
			if (image.naturalHeight == 0) {
				await new Promise((resolve) => {
					image.onload = resolve;
				});
			}
			let Konva = (await import('konva')).default;
			let scale = Math.min((window.innerWidth - 50) / 1.5 / image.naturalWidth, (window.innerHeight - 80) / 1.5 / image.naturalHeight);

			this.stage = new Konva.Stage({
				container: 'canvas',
				width: window.innerWidth - 50,
				height: window.innerHeight - 80,
				scale: {
					x: scale,
					y: scale
				}
			});

			let layer = new Konva.Layer();
			this.stage.add(layer);

			let imageObj = new Konva.Image({
				image: image,
				x: (this.stage.width() / 2) * (1 / scale) - image.naturalWidth / 2,
				y: (this.stage.height() / 2) * (1 / scale) - image.naturalHeight / 2,
				draggable: true
			});
			this.group = new Konva.Group();
			this.group.add(imageObj);
			let blurRect = new Konva.Image({
				image,
				width: 300,
				height: 100,
				pixelSize: 50,
				draggable: true
			});

			blurRect.filters([Konva.Filters.Pixelate]);
			blurRect.on('dragmove', (e) => {
				blurRect.scale({ x: 1, y: 1 });
				blurRect.crop({ x: -(imageObj.x() - blurRect.x()), y: -(imageObj.y() - blurRect.y()), width: blurRect.width(), height: blurRect.height() });
				blurRect.cache();
			});
			blurRect.on('transform', () => {
				blurRect.setAttrs({
					width: blurRect.width() * blurRect.scaleX(),
					height: blurRect.height() * blurRect.scaleY(),
					scaleX: 1,
					scaleY: 1
				});
				blurRect.crop({ x: -(imageObj.x() - blurRect.x()), y: -(imageObj.y() - blurRect.y()), width: blurRect.width(), height: blurRect.height() });
				blurRect.cache();
			});
			this.transformers = [
				new Konva.Transformer({
					nodes: [imageObj],
					rotateAnchorOffset: 20
				}),
				new Konva.Transformer({
					nodes: [blurRect],
					rotateAnchorOffset: 20,

					rotateEnabled: false
				})
			];
			this.group.add(blurRect);
			layer.add(this.group, ...this.transformers);
		},
		async saveEdit() {
			this.transformers.forEach((t) => {
				t.destroy();
			});
			this.stage.scale({ x: 1, y: 1 });
			_data = await new Promise((resolve) => {
				this.group.toBlob({
					callback: async (blob) => {
						if (blob && _data && _data instanceof File) {
							let name = ((value as any).original.name as string) || _data.name;
							let type = ((value as any).original.type as string) || _data.type;
							type = type.includes('svg') ? 'image/png' : type;
							name = name.endsWith('svg') ? name.replace('svg', 'png') : name;
							let file = new File([await blob.arrayBuffer()], name, {
								type
							});
							file.path = field.path;
							resolve(file);
						} else {
							resolve(undefined);
						}
					}
				});
			});
			editing = false;
			updated = true;
		}
	};

	let mediaOnSelect = (data: ImageFiles) => {
		updated = true;
		showMedia = false;
		_data = data;
	};
</script>

<input use:setFile bind:this={input} name={fieldName} type="file" hidden />

<!-- TODO: Add DropZone for better User experiance-->
<!-- <FileDropzone /> -->

{#if _data}
	<div class:editor={editing} class="flex flex-col border-dashed border-2 w-[500px] max-w-full border-gray-300">
		<div class="w-full h-[50px] bg-[#242734] flex items-center">
			{#if editing}
				<iconify-icon on:click={() => edit.saveEdit()} width="26" class="px-2 cursor-pointer" style="color:#05ff05" icon="ic:sharp-save-as"
				></iconify-icon>
				<button on:click={() => (editing = false)} class="ml-auto cursor-pointer mr-2">
					<XIcon />
				</button>
			{:else}
				<iconify-icon on:click={() => edit.startEdit()} class=" px-2 cursor-pointer text-white" icon="flat-color-icons:edit-image" width="24" />
				<iconify-icon
					on:click={() => (_data = undefined)}
					class="ml-auto px-2 cursor-pointer text-white"
					icon="streamline:arrow-reload-horizontal-1-solid"
					width="24"
				/>
			{/if}
		</div>
		{#if editing}
			<div id="canvas" class="flex items-center justify-center border-2 border-dashed border-black"></div>
		{:else}
			<img src={_data instanceof File ? URL.createObjectURL(_data) : _data.thumbnail.url} alt="" />
		{/if}
	</div>
{:else}
	<div
		on:drop|preventDefault={(e) => {
			updated = true;
			_data = e?.dataTransfer?.files[0];
		}}
		on:dragover|preventDefault={(e) => {
			asAny(e.target).style.borderColor = '#6bdfff';
		}}
		on:dragleave|preventDefault={(e) => {
			asAny(e.target).style.removeProperty('border-color');
		}}
		class="w-[500px] max-w-full h-[200px] mt-2 border-2 border-dashed border-[#c1c1c1] flex flex-col items-center justify-center gap-4 select-none"
	>
		<p>Drag & Drop</p>
		<p>or</p>
		<div class="flex w-full gap-2 justify-center">
			<Button style="flex: 1 1 0px;" on:click={() => input.click()}>Browse locally</Button>
			<Button style="flex: 1 1 0px;" on:click={() => (showMedia = true)}>Select Existing</Button>
		</div>
	</div>
{/if}
{#if showMedia}
	<div class="flex flex-col rounded-md p-2 fixed left-[50%] top-[50%] w-[90%] h-[80%] translate-y-[-50%] translate-x-[-50%] z-[999999999] bg-white">
		<button on:click={() => (showMedia = false)} class="ml-auto cursor-pointer">
			<XIcon />
		</button>
		<Media bind:onselect={mediaOnSelect} />
	</div>
{/if}

<style>
	img {
		max-width: 600px;
		max-height: 200px;
		margin: auto;
		margin-top: 10px;
	}
	.editor {
		overflow: auto;
		position: fixed;
		z-index: 999999999;
		top: 0;
		left: 0;
		width: calc(100vw - 2px);
		height: 100vh;
		background-color: #242734;
		animation: fadeIn 0.2s forwards;
	}
	@keyframes fadeIn {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
	:global(.editor canvas) {
		background-color: white !important;
	}
</style>
