<script lang="ts">
	import { SlideToggle } from '@skeletonlabs/skeleton';
	import FloatingInput from '@src/components/system/inputs/floatingInput.svelte';

	export let value: any;
	export let type: StringConstructor | NumberConstructor | BooleanConstructor = String;
	export let key: string;

	let inputType: any;
	//console.log(type);

	switch (type) {
		case String:
		case Number:
			inputType = FloatingInput;
			break;
		case Boolean:
			inputType = SlideToggle;
			break;
		default:
			break;
	}
</script>

<svelte:component this={inputType} bind:value label={key} theme="dark" />;
