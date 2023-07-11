<script lang="ts">
	import Toggle from '@src/components/system/buttons/Toggle.svelte';
	import FloatingInput from '@src/components/system/inputs/FloatingInput.svelte';
	export let value;
	export let type: StringConstructor | NumberConstructor | BooleanConstructor = String;
	export let key: string;
	let inputType;
	console.log(type);
	switch (type) {
		case String:
		case Number:
			inputType = FloatingInput;
			break;
		case Boolean:
			inputType = Toggle;
			break;
		default:
			break;
	}
</script>

<svelte:component this={inputType} bind:value label={key} theme="dark" />;
