<script lang="ts">
	import { SlideToggle } from '@skeletonlabs/skeleton';

	export let value: boolean = false;
</script>

<SlideToggle name="slide" bind:checked={value} />
