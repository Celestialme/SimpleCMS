<script lang="ts">
	import axios from 'axios';
	import type { FieldType } from '.';
	import { entryData, mode } from '@src/stores/store';
	import { asAny, getFieldName } from '@src/utils/utils';
	import Button from '@src/components/system/buttons/Button.svelte';
	import type { Layer } from 'konva/lib/Layer';
	import type { Transformer } from 'konva/lib/shapes/Transformer';
	import XIcon from '@src/components/system/icons/XIcon.svelte';
	export let field: FieldType;
	let _data: File | undefined;
	let updated = false;
	let input: HTMLInputElement;
	let container: HTMLDivElement;

	export const WidgetData = async () => {
		if (_data) {
			_data.path = field.path;
		}

		return updated ? _data : null;
		// return null;
	};
	export let value: File | { [key: string]: any } = $entryData[getFieldName(field)]; // pass file directly from imageArray

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
					type: value.mimetype
				});
				fileList.items.add(file);
				node.files = fileList.files;
				_data = node.files[0];
			});
		}
	}
	let editing = false;
	let edit = {
		layer: {} as Layer,
		transformers: [] as Transformer[],
		async startEdit() {
			updated = true;
			editing = true;
			let image = new Image();
			image.src = '/media/' + (value as any).original.url || URL.createObjectURL(_data as File);
			if (image.naturalHeight == 0) {
				await new Promise((resolve) => {
					image.onload = resolve;
				});
			}
			let Konva = (await import('konva')).default;
			var stage = new Konva.Stage({
				container: 'canvas',

				width: image.naturalWidth + 50,
				height: image.naturalHeight + 50
			});
			this.layer = new Konva.Layer();
			stage.add(this.layer);
			const rect = new Konva.Image({
				image: image,
				x: 25,
				y: 30,
				width: image.naturalWidth,
				height: image.naturalHeight,
				draggable: true
			});
			this.layer.add(rect);
			let tr = new Konva.Transformer({
				node: rect,
				rotateAnchorOffset: 20
			});
			this.transformers.push(tr);
			this.layer.add(tr);
		},
		async saveEdit() {
			this.transformers.forEach((t) => {
				t.destroy();
			});
			_data = await new Promise((resolve) => {
				this.layer.toBlob({
					callback: async (blob) => {
						if (blob && _data) {
							let name = ((value as any).original.name as string) || _data.name;
							name = name.endsWith('svg') ? name.replace('svg', 'png') : name;
							let file = new File([await blob.arrayBuffer()], name, {
								type: (value as any).original.type || _data.type
							});
							file.path = field.path;
							resolve(file);
						}
					}
				});
			});
			editing = false;
		}
	};
</script>

<input use:setFile bind:this={input} name={fieldName} type="file" hidden />

<!-- TODO: Add DropZone for better User experiance-->
<!-- <FileDropzone /> -->

{#if _data}
	<div bind:this={container} class:editor={editing} class="flex flex-col border-dashed border-2 w-[500px] max-w-full border-gray-300">
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
			<img src={URL.createObjectURL(_data)} alt="" />
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
		<Button on:click={() => input.click()}>Browse</Button>
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
