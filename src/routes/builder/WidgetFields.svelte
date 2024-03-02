<script lang="ts">
	import widgets from '@src/components/widgets';
	import InputSwitch from './InputSwitch.svelte';
	import { asAny } from '@src/utils/utils';
	import XIcon from '@src/components/system/icons/XIcon.svelte';
	export let fields: Array<any> = [];
	let widget_keys = Object.keys(widgets) as unknown as keyof typeof widgets;

	let container: HTMLDivElement;
	let currentFieldKey: keyof typeof widgets | null = null;
	let currentField: any;
	let guiSchema: (typeof widgets)[typeof widget_keys]['GuiSchema'];
	$: if (currentFieldKey) {
		guiSchema = widgets[currentFieldKey].GuiSchema;
	}
	let destruct = (node: HTMLDivElement) => {
		node.remove();
	};

	function drag(e: PointerEvent) {
		let timeOut;
		let node = e.currentTarget as HTMLDivElement;
		let pointerID = e.pointerId;

		let targets = [...container.getElementsByClassName('field')].map((el) => {
			let rect = el.getBoundingClientRect();
			return { el: el as HTMLElement, center: rect.top + rect.height / 2 };
		});
		node.onpointerup = () => {
			clearTimeout(timeOut);
		};
		node.onpointerleave = (e) => {
			clearTimeout(timeOut);
		};
		timeOut = setTimeout(() => {
			let clone = node.cloneNode(true) as HTMLElement;
			container.appendChild(clone);
			clone.setPointerCapture(pointerID);
			node.style.opacity = '0.5';
			clone.style.left = node.getBoundingClientRect().left + 'px';
			clone.style.marginLeft = '0';
			clone.style.position = 'fixed';
			clone.style.top = e.clientY + 'px';
			clone.style.width = node.getBoundingClientRect().width + 'px';
			clone.onpointermove = (e) => {
				if (e.clientY < container.offsetTop || e.clientY > container.offsetTop + container.offsetHeight - 60) {
					if (e.clientY < container.offsetTop) {
						container.scrollBy(0, -5);
					} else {
						container.scrollBy(0, 5);
					}
					targets = [...container.getElementsByClassName('field')].map((el) => {
						let rect = el.getBoundingClientRect();
						return { el: el as HTMLElement, center: rect.top + rect.height / 2 };
					});
				}
				clone.style.top = e.clientY + 'px';
				targets.sort((a, b) => (Math.abs(b.center - e.clientY) < Math.abs(a.center - e.clientY) ? 1 : -1));
				let closest = targets[0];
				if (closest.el == node) return;
				targets.forEach((el) => {
					(el.el as HTMLElement).style.removeProperty('border-color');
				});
				(closest.el as HTMLElement).style.borderColor = 'red';
			};
			clone.onpointerup = (e) => {
				node.style.opacity = '1';
				clone.releasePointerCapture(pointerID);
				targets.sort((a, b) => (Math.abs(b.center - e.clientY) < Math.abs(a.center - e.clientY) ? 1 : -1));
				let closest = targets[0];
				let closest_index = parseInt(closest.el.getAttribute('data-index') as string);
				let clone_index = parseInt(clone.getAttribute('data-index') as string);
				let dragged_item = fields.splice(clone_index, 1)[0];
				fields.splice(closest_index, 0, dragged_item);
				fields = fields;
				clone.remove();
				closest.el.style.removeProperty('border-color');
			};
		}, 200);
	}
</script>

<div class="wrapper" bind:this={container}>
	{#each fields as field, index}
		<div
			on:click={() => {
				currentFieldKey = field.widget.key;
				currentField = field;
			}}
			on:pointerdown|stopPropagation={drag}
			class="field"
			data-index={index}
		>
			<div class="w-full h-full p-[10px]">
				<p>widget: {field.widget.key}</p>
				<p>label: {field.label}</p>
			</div>
			<button
				class="absolute right-[5px] top-[5px]"
				on:click|stopPropagation={() => {
					fields = [...fields.filter((f) => f !== field)];
				}}><iconify-icon icon="tdesign:delete-1" width="24" height="24" /></button
			>
		</div>
		<div use:destruct>
			{#each Object.entries(widgets[field.widget.key].GuiSchema) as [property, value]}
				<InputSwitch bind:value={field.widget.GuiFields[property]} widget={asAny(value).widget} key={property} />
			{/each}
		</div>
	{/each}
</div>

{#if currentField}
	<div class="properties">
		<button class="ml-auto mr-[40px]" on:click={() => (currentField = null)}><XIcon /></button>
		{#each Object.entries(guiSchema) as [property, value]}
			<InputSwitch bind:value={currentField.widget.GuiFields[property]} widget={asAny(value).widget} key={property} />
		{/each}
	</div>
{/if}

<style>
	.wrapper {
		max-height: 100%;
		overflow: auto;
		margin-bottom: 20px;
		margin-top: 20px;
		background-color: #333637;
		box-shadow: 4px 7px 20px 1px #ffffff69;
		border-radius: 12px;
		min-width: min(500px, 90vw);
		user-select: none;
	}
	.field {
		overflow: hidden;
		position: relative;
		text-align: left;
		color: white;
		background-color: transparent;
		margin-bottom: 4px;
		font-size: 20px;
		border-radius: 10px;
		cursor: pointer;
		border: 1px solid cyan;
		margin-bottom: 10px;
	}
	.field p {
		border-bottom: 1px solid #80808029;
		margin-bottom: 10px;
		padding-bottom: 5px;
	}
	.field div:hover {
		background-color: #4fdc4f;
	}
	.properties {
		position: fixed;
		flex-direction: column;
		display: flex;
		justify-content: center;
		align-items: center;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: #242728;
		overflow: auto;
		z-index: 111;
	}
</style>
