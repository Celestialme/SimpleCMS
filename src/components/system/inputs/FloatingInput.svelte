<script lang="ts">
	import 'iconify-icon';
	export let iconClass = '';
	export let inputClass = '';
	export let name: string;
	export let label: string;
	export let type: 'password' | 'text' | 'email' = 'text';
	export let leading_icon = getIcon();
	export let value = '';
	export let required = false;
	export let theme: 'dark' | 'light' = 'light';
	let showPassword = false;
	let inputElement: HTMLInputElement;
	$: if (type === 'password') showPassword ? inputElement && (inputElement.type = 'text') : inputElement && (inputElement.type = 'password');

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
	<slot />
	<iconify-icon icon={leading_icon} class={iconClass} />

	<input class={inputClass} bind:this={inputElement} use:initInput placeholder=" " type="text" {name} id="input" bind:value />
	<label for="input" class="text-xs text-gray-400"
		>{label}
		{#if required}
			<span class="text-red-500">*</span>
		{/if}
	</label>
	{#if type === 'password'}
		<iconify-icon
			icon={showPassword ? 'bi:eye-fill' : 'bi:eye-slash-fill'}
			class="absolute right-0"
			class:text-gray-400={theme == 'dark'}
			width="24"
			on:click|preventDefault={() => (showPassword = !showPassword)}
		/>
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
		background-color: transparent;
	}
	label {
		position: absolute;
		left: 20px;
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
		color: blue;
		font-size: 10px;
	}
	.dark input:focus + label {
		color: #82d0ff;
	}
	input:not(:placeholder-shown) + label {
		top: unset;
		top: 0;
		margin-top: -10px;
		transform: translateY(0);

		font-size: 10px;
	}
</style>
