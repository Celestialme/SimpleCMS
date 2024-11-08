<script lang="ts">
	import { mode, modifyEntry } from '@src/stores/store.svelte';

	interface Props {
		buttons?: any;
		defaultButton?: keyof typeof buttons;
	}

	let {
		buttons = {
			Create: {
				fn: () => mode.set('create'),
				icon: 'gravity-ui:plus',
				bg_color: '#15d515',
				color: 'white'
			},
			Delete: {
				fn: () => modifyEntry()('Delete'),
				icon: 'tdesign:delete-1',
				bg_color: 'red',
				color: 'white'
			},
			Publish: {
				fn: () => modifyEntry()('Publish'),
				icon: '',
				bg_color: 'lime',
				color: 'white'
			},
			Unpublish: {
				fn: () => modifyEntry()('Unpublish'),

				icon: '',
				bg_color: 'orange',
				color: 'white'
			},
			Test: {
				fn: () => modifyEntry()('Test'),
				icon: '',
				bg_color: 'brown',
				color: 'white'
			}
		},
		defaultButton = $bindable('Create')
	}: Props = $props();
	let expanded = $state(false);
	$effect(() => {
		defaultButton = mode() == 'modify' ? 'Delete' : 'Create';
		expanded = mode() == 'modify' ? expanded : false;
	});

	let activeArrow = $derived(mode() == 'modify');
</script>

<div class="wrapper md:w-[200px]">
	<button
		style="--color:{buttons[defaultButton].color};background-color:{buttons[defaultButton]
			.bg_color}"
		class="flex-grow default flex items-center justify-center max-md:!p-[10px]"
		class:rounded-bl-[10px]={!expanded}
		onclick={buttons[defaultButton].fn}
		><iconify-icon class="md:hidden" icon={buttons[defaultButton].icon}></iconify-icon>
		<span class="max-md:hidden">
			{defaultButton}
		</span>
	</button>
	<div
		onclick={() => (expanded = !expanded)}
		class=" w-[50px] relative hover:active:scale-95 rounded-r-[10px]"
		class:cursor-pointer={activeArrow}
		class:pointer-events-none={!activeArrow}
		style="background-color: rgb(37, 36, 36);"
	>
		<div class="arrow" class:!border-red-800={!activeArrow}></div>
	</div>
	<div class="buttons rounded-b-[10px] overflow-hidden" class:expanded>
		{#each Object.keys(buttons) as button}
			{#if button != defaultButton && button != 'Create' && mode() == 'modify'}
				<button
					style="--color:{buttons[button].color};--bg-color:{buttons[button].bg_color ||
						'rgb(37, 36, 36)'}"
					class="w-full nested"
					onclick={buttons[button].fn}
				>
					<iconify-icon icon={buttons[button].icon}></iconify-icon>
					{button}</button
				>
			{/if}
		{/each}
	</div>
</div>

<style>
	.arrow {
		position: absolute;
		left: 43%;
		top: 50%;
		border: solid white;
		border-width: 0 4px 4px 0;
		display: inline-block;
		padding: 6px;
		transform: rotate(45deg) translate(-50%, -50%);
		transform-origin: top;
	}
	.buttons {
		display: none;
		position: absolute;
		top: 100%;
		width: 100%;
		min-width: 200px;
		right: 0;
		top: 100%;
		margin-top: 2px;
	}
	.expanded {
		display: block;
	}
	.wrapper {
		position: relative;
		display: flex;
		align-items: center;
	}
	.nested,
	.default {
		font-size: 22px;
		padding: 5px 10px;
		color: var(--color);
		height: 100%;
	}
	.default {
		border-top-left-radius: 10px;
	}

	.nested {
		background-color: rgb(37, 36, 36);
		color: white;
	}

	.buttons .nested:not(:global(:last-of-type)) {
		border-bottom: 1px solid rgb(88, 87, 87);
	}
	.nested:hover {
		background-color: var(--bg-color);
	}
	button:active {
		transform: scale(0.95);
	}
</style>
