<script lang="ts">
	import { mode } from '@src/stores/store';
	import { currentChild } from '.';
	import { contentLanguage, headerActionButton } from '@src/stores/load';
	import XIcon from '@src/components/system/icons/XIcon.svelte';
	import type { CustomDragEvent } from './types';
	import { onMount, tick } from 'svelte';
	import { debounce } from '@src/utils/utils';
	export let self: { [key: string]: any; children: any[] };
	export let parent: { [key: string]: any; children: any[] } | null = null;
	export let level = 0;
	export let depth = 0;
	export let showFields = false;
	export let maxDepth = 0;
	export let expanded = false;
	export let MENU_CONTAINER: HTMLUListElement;
	let fields_container: HTMLDivElement;
	onMount(() => {
		fields_container = document.getElementById('fields_container') as HTMLDivElement;
	});
	let expanded_list: boolean[] = [];
	let ul: HTMLElement;
	export let refresh = () => {
		self?.children && (self.children = self.children);
	};
	function setBorderHeight(node: HTMLElement | null | undefined) {
		if (!node) return;

		setTimeout(async () => {
			let lastHeader = node?.lastChild?.firstChild as HTMLElement;
			if (!lastHeader) return;
			let border = node?.querySelector('.border') as HTMLElement;
			border && (border.style.height = lastHeader.offsetTop + lastHeader.offsetHeight / 2 + 'px');
		}, 0);
	}

	$: if (self?.children?.length) {
		recalculateBorderHeight();
		ul;
	}
	$: if (showFields) {
		$headerActionButton = XIcon;
	}

	function recalculateBorderHeight() {
		MENU_CONTAINER &&
			MENU_CONTAINER.querySelectorAll('ul').forEach((el) => {
				setBorderHeight(el);
			});
	}
	function notifyChildren(node: HTMLElement) {
		node.addEventListener('custom:notifyChildren', (e) => {
			let details = (e as any).detail as { clone_isExpanded: boolean };
			expanded_list.push(details.clone_isExpanded);
			expanded_list = expanded_list;
		});
	}
	function drag(node: HTMLElement) {
		node.addEventListener('custom:drag', async (e) => {
			let event = e as CustomDragEvent;
			let clone_isExpanded = event.detail.expanded_list.splice(event.detail.clone_index, 1)[0];
			if (event.detail.isParent) {
				self.children[event.detail.closest_index].children.push(event.detail.dragged_item);
				await tick();

				node.firstChild?.dispatchEvent(
					new CustomEvent('custom:notifyChildren', {
						detail: {
							clone_isExpanded
						}
					})
				);
			} else {
				// let isSameParent = self.children.indexOf(event.detail.children[event.detail.clone_index]) !== -1;

				self?.children?.splice(event.detail.closest_index, 0, event.detail.dragged_item);
				expanded_list.splice(event.detail.closest_index, 0, clone_isExpanded);
				expanded_list = expanded_list;
			}
			event.detail.refresh_expanded_list();
		});

		node.onpointerdown = (e) => {
			e.stopPropagation();
			let node = e.currentTarget as HTMLElement;
			let pointerID = e.pointerId;

			node.onpointerleave = node.onpointerup = (e) => {
				clearTimeout(timeout);
			};

			let timeout = setTimeout(() => {
				node.style.opacity = '0.5';

				let clone = node.cloneNode(true) as HTMLElement;
				MENU_CONTAINER.appendChild(clone);
				clone.style.left = node.getBoundingClientRect().left + 'px';
				clone.style.marginLeft = '0';
				clone.style.position = 'fixed';
				clone.style.top = e.clientY + 'px';
				clone.setPointerCapture(pointerID);
				let cloneHeight = clone.offsetHeight + 10 + 'px';
				let targets: any = [];
				let deb = debounce(3);
				let old_closest: HTMLElement;
				clone.onpointermove = (e) => {
					if (e.clientY < fields_container.offsetTop || e.clientY > fields_container.offsetTop + fields_container.offsetHeight - 60) {
						if (e.clientY < fields_container.offsetTop) {
							fields_container.scrollBy(0, -5);
						} else {
							fields_container.scrollBy(0, 5);
						}
					}
					clone.style.top = e.clientY + 'px';
					clone.style.opacity = '1';
					deb(() => {
						let siblings = [...document.getElementsByClassName(`level-${level}`)]
							.map((el) => {
								let rect = el.getElementsByClassName('header')[0].getBoundingClientRect();
								return { el: el as HTMLElement, center: rect.top + rect.height / 2, isParent: false };
							})
							.filter((el) => el.el != clone);
						let parents = [...document.getElementsByClassName(`level-${level - 1}`)]
							.filter((el) => parseInt(el.getAttribute('data-children') as string) == 0)
							.map((el) => {
								let rect = el.getElementsByClassName('header')[0].getBoundingClientRect();
								return { el: el as HTMLElement, center: rect.top + rect.height / 2, isParent: true };
							});
						targets = [...siblings, ...parents];
						targets.sort((a, b) => (Math.abs(b.center - e.clientY) < Math.abs(a.center - e.clientY) ? 1 : -1));
						let closest = targets[0];
						if (old_closest) {
							old_closest.firstChild && ((old_closest.firstChild as HTMLElement).style.borderColor = '#80808045');
							old_closest.style.padding = '0';
						}
						if (closest.el == node) return;
						let closest_index = parseInt(closest.el.getAttribute('data-index') as string);
						let clone_index = parseInt(clone.getAttribute('data-index') as string);

						if (e.clientY > closest.center && clone_index - closest_index != 1 && !closest.isParent) {
							closest.el.style.paddingBottom = cloneHeight;
						} else if (e.clientY < closest.center && !closest.isParent && closest_index - clone_index != 1) {
							closest.el.style.paddingTop = cloneHeight;
						}
						closest.el.firstChild && ((closest.el.firstChild as HTMLElement).style.borderColor = closest.isParent ? 'blue' : 'red');
						recalculateBorderHeight();
						setTimeout(() => {
							recalculateBorderHeight();
						}, 110);
						old_closest = closest.el;
					});
				};

				clone.onpointerup = async (e) => {
					clone.releasePointerCapture(pointerID);
					clone.remove();
					targets.forEach((el) => {
						el.el.firstChild && ((el.el.firstChild as HTMLElement).style.borderColor = '#80808045');
						el.el.style.padding = '0';
					});

					node.style.opacity = '1';
					targets.sort((a, b) => (Math.abs(b.center - e.clientY) < Math.abs(a.center - e.clientY) ? 1 : -1));
					let closest = targets[0];

					if (closest.el == node) return;

					let closest_index = parseInt(closest.el.getAttribute('data-index') as string);
					let clone_index = parseInt(clone.getAttribute('data-index') as string);
					let dragged_item = self.children.splice(clone_index, 1)[0];
					if (clone_index < closest_index && !closest.isParent) {
						closest_index--;
					}
					closest.el.dispatchEvent(
						new CustomEvent('custom:drag', {
							detail: {
								closest_index: closest.isParent ? closest_index : e.clientY < closest.center ? closest_index : closest_index + 1,
								clone_index,
								isParent: closest.isParent,
								expanded_list,
								dragged_item,
								refresh_expanded_list: () => (expanded_list = expanded_list)
							}
						})
					);
					refresh();
					setTimeout(() => {
						recalculateBorderHeight();
					}, 120);
				};
			}, 200);
		};
	}
</script>

<div
	use:notifyChildren
	on:click={(e) => {
		if (expanded) {
			recalculateBorderHeight();
		}
		expanded = !expanded;
	}}
	class="header header-level-{level}"
	class:!cursor-pointer={self?.children?.length > 0}
	style="margin-left:{20 * (level > 0 ? 1 : 0)}px;
	{window.screen.width <= 700
		? `min-width:calc(100% + ${20 * (maxDepth * maxDepth - (level > 0 ? 1 : 0))}px)`
		: `max-width:calc(100% - ${20 * (level > 0 ? 1 : 0)}px)`}"
>
	<div class="ladder" style="width:{20 * (level > 0 ? 1 : 0)}px" />
	{#if self?.children?.length > 0}
		<div class="arrow" class:expanded />
	{/if}
	{self?.Header[$contentLanguage]}
	<div class="flex items-center ml-auto gap-1">
		{#if level < maxDepth - 1}
			<button
				on:click|stopPropagation={() => {
					$currentChild = self;
					depth = level + 1;
					showFields = true;
					mode.set('create');
				}}><iconify-icon icon="uil:focus-add" width="24" height="24" /></button
			>
		{/if}
		<button
			on:click|stopPropagation={() => {
				$currentChild = self;
				$mode = 'edit';
				depth = level;
				showFields = true;
			}}><iconify-icon icon="raphael:edit" width="24" height="24" /></button
		>
		{#if level > 0}
			<button
				on:click|stopPropagation={() => {
					parent?.children?.splice(parent?.children?.indexOf(self), 1);
					refresh();
				}}><iconify-icon icon="tdesign:delete-1" width="24" height="24" /></button
			>
		{/if}
	</div>
</div>

{#if self?.children?.length > 0 && expanded}
	<ul bind:this={ul} class="children relative" style="margin-left:{20 * (level > 0 ? 1 : 0) + 15}px;">
		<div class="border" />
		{#each self.children as child, index}
			<li use:drag data-children={expanded_list[index] ? child.children?.length : 0} data-index={index} class={`level-${level} touch-none`}>
				<svelte:self
					{MENU_CONTAINER}
					{refresh}
					self={child}
					level={level + 1}
					bind:depth
					bind:showFields
					parent={self}
					{maxDepth}
					bind:expanded={expanded_list[index]}
				/>
			</li>
		{/each}
	</ul>
{/if}

<style>
	.header {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 2px;
		border: 1px solid #80808045;
		border-radius: 5px;
		padding: 10px 0px;
		padding-left: 50px;
		padding-right: 10px;
		margin-bottom: 5px;
		width: 100vw;
		min-width: 200px;
		cursor: default;
	}
	li {
		transition: padding 0.1s ease-in-out;
	}
	.ladder {
		position: absolute;
		height: 0;
		right: 100%;
		border-top: 1px dashed;
	}
	.arrow {
		position: absolute;
		left: 10px;
		top: 40%;
		transform: translateY(-50%);
		border: solid black;
		border-width: 0 3px 3px 0;
		display: inline-block;
		padding: 3px;
		transform: rotate(-45deg);
		margin-right: 10px;
		transition: transform 0.1s ease-in;
	}
	.expanded {
		transform: rotate(45deg);
	}
	button:active {
		transform: scale(0.9);
	}
	.border {
		content: '';
		position: absolute;
		left: 0;
		width: 0;
		border-left: 1px dashed;
		max-height: 100%;
	}
	ul {
		overflow: visible;
		user-select: none;
	}
</style>
