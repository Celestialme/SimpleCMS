<script lang="ts">
	export let type: 'text' | 'password' = 'text';
	export let value = '';
	export let label = '';
	export let labelClass = '';
	export let inputClass = '';
	const handleInput = (e: Event) => {
		value = (e.target as HTMLInputElement).value;
	};
</script>

<div>
	{#if label}
		<label for="input" class={labelClass}>{label}</label>
	{/if}
	<input {type} on:input={handleInput} id="input" class={inputClass} {value} />
</div>

<style>
	div {
		min-width: 280px;
		margin: 5px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	label {
		margin-right: 10px;
	}
	input {
		border: 1px solid #242728;
		border-radius: 6px;
		padding: 5px;
		color: black;
		padding-right: 18px;
		outline-color: #65caec;
	}
</style>
