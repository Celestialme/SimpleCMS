<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Input from './Input.svelte';
	export let items: string[] = [];
	export let placeholder: string = '';
	let value = '';
	let filteredItems: string[] = [];
	let showDropdown = false;
	const dispatch = createEventDispatcher();
	const handleInput = (event: Event) => {
		value = (event.target as HTMLInputElement).value;
		filteredItems = items.filter((item) => item.toLowerCase().includes(value.toLowerCase()));
		showDropdown = true;
	};
	const handleSelect = (item: string) => {
		value = item;
		showDropdown = false;
		dispatch('select', { value });
	};
</script>

<div class="relative">
	<Input type="text" labelClass="hidden" inputClass="border rounded p-2 " {placeholder} on:input={handleInput} bind:value />
	{#if showDropdown}
		<ul class="absolute z-10 rounded border bg-white">
			{#each filteredItems as item}
				<li class="cursor-pointer p-2 hover:bg-gray-100" on:click={() => handleSelect(item)}>
					{item}
				</li>
			{/each}
		</ul>
	{/if}
</div>
