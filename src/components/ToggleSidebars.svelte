<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let id;
	export let label;
	export let checked = false;

	const dispatch = createEventDispatcher();

	function handleChange(event) {
		checked = event.target.checked;
		localStorage.setItem(id, checked);
		dispatch('change', { checked });
	}

	// load the saved value from local storage
	$: {
		if (id) {
			const savedValue = localStorage.getItem(id);
			if (savedValue !== null) {
				checked = savedValue === 'true';
			}
		}
	}
</script>

<label>
	<input type="checkbox" bind:checked on:change={handleChange} />
	{label}
</label>
