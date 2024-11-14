<script lang="ts">
	interface Props {
		type?: 'text' | 'password' | 'email';
		label?: string;
		labelClass?: string;
		inputClass?: string;
		placeholder?: string;
		value?: string;
	}

	let {
		type = 'text',
		label = '',
		labelClass = '',
		inputClass = '',
		placeholder = '',
		value = $bindable(''),
		...props
	}: Props = $props();
	function typeAction(node: HTMLInputElement) {
		node.type = type;
	}
</script>

<div>
	{#if label}
		<label for="input" class={labelClass}>{label}</label>
	{/if}
	<input use:typeAction id="input" class={inputClass} bind:value {placeholder} {...props} />
</div>

<style>
	div {
		max-width: 100%;

		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	label {
		margin-right: 10px;
	}
	input {
		box-sizing: border-box;
		border: 1px solid #c1c1c1;
		border-radius: 4px;
		padding: 5px;
		color: black;
		padding-right: 18px;
		outline-color: #65caec;
		max-width: 100%;
		width: 350px;
	}
</style>
