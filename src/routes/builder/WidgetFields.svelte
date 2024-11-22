<script lang="ts">
	import { debounce } from '@src/utils/utils';
	import AddWidget from './AddWidget.svelte';
	interface Props {
		fields?: Array<any>;
	}

	let { fields = $bindable([]) }: Props = $props();

	let container = $state() as HTMLDivElement;
	let currentFieldKey: any = $state(null);
	let currentField: any = $state();

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
		node.onpointerleave = (_) => {
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
			let cloneHeight = clone.offsetHeight + 10 + 'px';
			let deb = debounce(50);
			let old_closest: HTMLElement;
			clone.onpointermove = (e) => {
				if (
					e.clientY < container.offsetTop ||
					e.clientY > container.offsetTop + container.offsetHeight - 60
				) {
					if (e.clientY < container.offsetTop) {
						container.scrollBy(0, -5);
					} else {
						container.scrollBy(0, 5);
					}
				}
				clone.style.top = e.clientY + 'px';
				deb(() => {
					targets = [...container.getElementsByClassName('field')]
						.map((el) => {
							let rect = el.getBoundingClientRect();
							return { el: el as HTMLElement, center: rect.top + rect.height / 2 };
						})
						.filter((el) => el.el != clone);
					targets.sort((a, b) =>
						Math.abs(b.center - e.clientY) < Math.abs(a.center - e.clientY) ? 1 : -1
					);
					let closest = targets[0];
					if (closest.el == node) return;
					let closest_index = parseInt(closest.el.getAttribute('data-index') as string);
					let clone_index = parseInt(clone.getAttribute('data-index') as string);

					if (old_closest) {
						old_closest.style.removeProperty('border-color');
						old_closest.style.margin = '10px 0';
					}
					if (e.clientY > closest.center && clone_index - closest_index != 1) {
						closest.el.style.marginBottom = cloneHeight;
					} else if (e.clientY < closest.center && closest_index - clone_index != 1) {
						closest.el.style.marginTop = cloneHeight;
					}
					(closest.el as HTMLElement).style.borderColor = 'red';
					old_closest = closest.el;
				});
			};
			clone.onpointerup = (e) => {
				node.style.opacity = '1';
				clone.releasePointerCapture(pointerID);
				targets.sort((a, b) =>
					Math.abs(b.center - e.clientY) < Math.abs(a.center - e.clientY) ? 1 : -1
				);
				let closest = targets[0];
				let closest_index = parseInt(closest.el.getAttribute('data-index') as string);
				let clone_index = parseInt(clone.getAttribute('data-index') as string);
				let dragged_item = fields.splice(clone_index, 1)[0];

				if (clone_index < closest_index) {
					closest_index--;
				}
				e.clientY > closest.center && closest_index++;
				fields.splice(closest_index, 0, dragged_item);
				fields = fields;
				clone.remove();
				setTimeout(() => {
					targets.forEach((el) => {
						(el.el as HTMLElement).style.removeProperty('border-color');
						el.el.style.margin = '10px 0';
					});
				}, 50);
			};
		}, 200);
	}
</script>

<div class="wrapper" bind:this={container}>
	{#each fields as field, index}
		<div
			onclick={() => {
				currentFieldKey = field.widgetName;
				currentField = field;
			}}
			onpointerdown={(e) => {
				e.stopPropagation();
				drag(e);
			}}
			class="field"
			data-index={index}
		>
			<div class="w-full h-full p-[10px]">
				<p>widget: {field.widgetName}</p>
				<p>label: {field.label}</p>
			</div>
			<button
				class="absolute right-[5px] top-[5px]"
				onclick={(e) => {
					e.stopPropagation();
					fields = [...fields.filter((f) => f !== field)];
				}}><iconify-icon icon="tdesign:delete-1" width="24" height="24"></iconify-icon></button
			>
		</div>
	{/each}
</div>

{#if currentField}
	<AddWidget
		bind:fields
		bind:field={currentField}
		bind:addField={currentField}
		selected_widget={currentFieldKey}
		editField={true}
	/>
{/if}

<style>
	.wrapper {
		padding: 2px;
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
		transition: margin 0.1s ease-in-out;
	}
	.field p {
		border-bottom: 1px solid #80808029;
		margin-bottom: 10px;
		padding-bottom: 5px;
	}
	.field div:hover {
		background-color: #4fdc4f;
	}
</style>
