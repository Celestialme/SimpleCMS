<script lang="ts">
	import { store } from '@src/stores/store.svelte';
	import { twMerge } from 'tailwind-merge';
	interface Props {
		iconClass?: string;
		inputClass?: string;
		name: string;
		label: string;
		type?: 'password' | 'text' | 'email';
		leading_icon?: any;
		value?: string;
		required?: boolean;
		theme?: 'dark' | 'light';
		children?: import('svelte').Snippet;
		oninput?: (e: Event) => void;
		onkeydown?: (e: KeyboardEvent) => void;
	}

	let {
		iconClass = '',
		inputClass = '',
		name,
		label,
		type = 'text',
		leading_icon = getIcon(),
		value = $bindable(''),
		required = false,
		theme = 'light',
		oninput,
		onkeydown,
		children
	}: Props = $props();

	let inputElement = store<HTMLInputElement>();

	function getIcon() {
		switch (type) {
			case 'email':
				return 'mdi:email';
			case 'password':
				return 'mdi:lock';
			default:
				return '';
		}
	}
	function initInput(node: HTMLInputElement) {
		node.type = type;
	}
</script>

<div class="container relative" class:dark={theme == 'dark'}>
	{@render children?.()}
	<iconify-icon icon={leading_icon} class={iconClass}></iconify-icon>

	<input
		class={twMerge('bg-transparent text-black', inputClass)}
		bind:this={inputElement.value}
		use:initInput
		placeholder=" "
		type="text"
		{name}
		id="input"
		bind:value
		class:text-white={theme == 'dark'}
		{oninput}
		{onkeydown}
	/>
	<label for="input" class="text-xs text-gray-400"
		>{label}
		{#if required}
			<span class="text-red-500">*</span>
		{/if}
	</label>
	{#if type === 'password'}
		<iconify-icon
			icon={inputElement()?.type != 'password' ? 'bi:eye-fill' : 'bi:eye-slash-fill'}
			class="absolute right-0"
			class:text-gray-400={theme == 'dark'}
			width="24"
			onclick={(e) => {
				e.preventDefault();
				inputElement().type = inputElement().type == 'text' ? 'password' : 'text';
				inputElement.trigger();
			}}
		></iconify-icon>
	{/if}
</div>

<style>
	.container {
		position: relative;
		display: flex;
		width: 100%;
		border-bottom: 1px solid #242728;
		padding: 5px 0px;
		gap: 10px;
		align-items: center;
		margin: 5px 0;
	}
	.dark.container {
		border-bottom: 1px solid #afafaf;
	}
	input {
		display: inline-block;
		border: none;
		outline: none;
		width: 100%;
	}
	label {
		position: absolute;
		left: min(10%, 20px);
		top: 50%;
		transform: translateY(-50%);
		pointer-events: none;
		transition: 0.2s;
	}
	input:focus + label {
		top: unset;
		top: 0;
		left: 0;
		margin-top: -10px;
		transform: translateY(0);
		color: black;
		font-size: 10px;
	}
	.dark input:focus + label {
		color: #82d0ff;
	}
	input:not(:global(:placeholder-shown)) + label {
		top: unset;
		top: 0;
		margin-top: -10px;
		transform: translateY(0);

		font-size: 10px;
	}
</style>
