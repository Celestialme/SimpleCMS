<script lang="ts">
	import axios from 'axios';
	import type { FieldType } from '.';
	import { entryData, mode } from '@src/stores/store';
	import { getFieldName } from '@src/utils/utils';
	import Button from '@src/components/system/buttons/Button.svelte';
	import type { Transformer } from 'konva/lib/shapes/Transformer';
	import XIcon from '@src/components/system/icons/XIcon.svelte';
	import type { Group } from 'konva/lib/Group';
	import type { ImageFiles } from '@src/utils/types';
	import type { Stage } from 'konva/lib/Stage';
	import type { Image as KonvaImage } from 'konva/lib/shapes/Image';
	import type { Layer } from 'konva/lib/Layer';
	import FileInput from '@src/components/system/inputs/FileInput.svelte';
	export let field: FieldType;
	export let value: File | ImageFiles = $entryData[getFieldName(field)]; // pass file directly from imageArray
	let _data: File | ImageFiles | undefined = value;
	$: updated = _data !== value;
	export const WidgetData = async () => {
		if (_data) {
			if (_data instanceof File) {
				_data.path = field.path;
			}
		}

		return updated ? _data : null;
	};

	if ($mode == 'edit') {
		(value as ImageFiles)?.thumbnail?.url &&
			axios.get((value as ImageFiles).thumbnail.url, { responseType: 'blob' }).then(({ data }) => {
				if (value instanceof File) return;
				let file = new File([data], value.thumbnail.name, {
					type: value.thumbnail.type
				});

				_data = file;
			});
	}
	let editing = false;
	let edit = {
		stage: {} as Stage,
		group: {} as Group,
		transformers: [] as Transformer[],
		layer: {} as Layer,
		imageObj: {} as KonvaImage,
		image: {} as HTMLImageElement,
		async startEdit() {
			editing = true;
			this.image = new Image();
			if (_data && updated) {
				if (_data instanceof File) {
					this.image.src = URL.createObjectURL(_data as File);
				} else {
					this.image.src = '/media/' + _data.original.url;
				}
			} else {
				this.image.src = '/media/' + (value as ImageFiles).original.url;
			}
			if (this.image.naturalHeight == 0) {
				await new Promise((resolve) => {
					this.image.onload = resolve;
				});
			}
			let Konva = (await import('konva')).default;
			let scale = Math.min(
				(window.innerWidth - 50) / 1.5 / this.image.naturalWidth,
				(window.innerHeight - 80) / 1.5 / this.image.naturalHeight
			);

			this.stage = new Konva.Stage({
				container: 'canvas',
				width: window.innerWidth - 50,
				height: window.innerHeight - 80,
				scale: {
					x: scale,
					y: scale
				}
			});

			this.layer = new Konva.Layer();
			this.stage.add(this.layer);

			this.imageObj = new Konva.Image({
				image: this.image,
				x: (this.stage.width() / 2) * (1 / scale) - this.image.naturalWidth / 2,
				y: (this.stage.height() / 2) * (1 / scale) - this.image.naturalHeight / 2,
				draggable: true
			});
			this.group = new Konva.Group();
			this.group.add(this.imageObj);

			this.transformers = [
				new Konva.Transformer({
					nodes: [this.imageObj],
					rotateAnchorOffset: 20
				})
			];

			this.layer.add(this.group, ...this.transformers);
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
		},
		async addBlur() {
			let Konva = (await import('konva')).default;
			let range = document.createElement('input');
			let canvas = document.getElementsByTagName('canvas')[0] as HTMLCanvasElement;
			range.type = 'range';
			range.min = '0';
			range.max = '30';
			range.value = '15';
			range.style.position = 'absolute';

			range.onchange = () => {
				blurRect.pixelSize(Number(range.value));
			};
			let updateRangePos = () => {
				let rect = canvas.getBoundingClientRect();
				range.style.left =
					(blurRect.x() + blurRect.width() / 2) * this.stage.scaleX() -
					range.offsetWidth / 2 +
					rect.left +
					'px';
				range.style.top =
					(blurRect.y() + blurRect.height()) * this.stage.scaleY() + 20 + rect.top + 'px';
			};
			let blurRect = new Konva.Image({
				image: this.image,
				width: 300,
				height: 100,
				pixelSize: range.value,
				draggable: true
			});

			blurRect.filters([Konva.Filters.Pixelate]);
			blurRect.on('dragmove', (e) => {
				blurRect.scale({ x: 1, y: 1 });
				blurRect.crop({
					x: -(this.imageObj.x() - blurRect.x()),
					y: -(this.imageObj.y() - blurRect.y()),
					width: blurRect.width(),
					height: blurRect.height()
				});
				updateRangePos();
				blurRect.cache();
			});
			blurRect.on('transform', () => {
				blurRect.setAttrs({
					width: blurRect.width() * blurRect.scaleX(),
					height: blurRect.height() * blurRect.scaleY(),
					scaleX: 1,
					scaleY: 1
				});
				blurRect.crop({
					x: -(this.imageObj.x() - blurRect.x()),
					y: -(this.imageObj.y() - blurRect.y()),
					width: blurRect.width(),
					height: blurRect.height()
				});
				blurRect.cache();
				updateRangePos();
			});

			canvas.parentElement?.parentElement?.appendChild(range);
			updateRangePos();
			let tr = new Konva.Transformer({
				rotateAnchorOffset: 20,
				nodes: [blurRect],
				rotateEnabled: false
			});
			this.transformers.push(tr);
			this.layer.add(tr);
			this.group.add(blurRect);
		}
	};
</script>

{#if _data}
	<div
		class:editor={editing}
		class="flex flex-col border-dashed border-2 w-[500px] max-w-full border-gray-300"
	>
		<div class="w-full h-[50px] bg-[#242734] flex items-center">
			{#if editing}
				<iconify-icon
					on:click={() => edit.saveEdit()}
					width="26"
					class="px-2 cursor-pointer"
					style="color:#05ff05"
					icon="ic:sharp-save-as"
				></iconify-icon>
				<Button on:click={() => edit.addBlur()}>blur</Button>
				<button on:click={() => (editing = false)} class="ml-auto cursor-pointer mr-2">
					<XIcon />
				</button>
			{:else}
				<iconify-icon
					on:click={() => edit.startEdit()}
					class=" px-2 cursor-pointer text-white"
					icon="flat-color-icons:edit-image"
					width="24"
				/>
				<iconify-icon
					on:click={() => (_data = undefined)}
					class="ml-auto px-2 cursor-pointer text-white"
					icon="streamline:arrow-reload-horizontal-1-solid"
					width="24"
				/>
			{/if}
		</div>
		{#if editing}
			<div
				id="canvas"
				class="flex items-center justify-center border-2 border-dashed border-black"
			></div>
		{:else}
			<img src={_data instanceof File ? URL.createObjectURL(_data) : _data.thumbnail.url} alt="" />
		{/if}
	</div>
{:else}
	<FileInput bind:value={_data} />
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
