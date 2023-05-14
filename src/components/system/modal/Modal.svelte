<script lang="ts">
	let modalOpen = false;
</script>

<button on:click={() => (modalOpen = true)}>Open Modal</button>

{#if modalOpen}
	<div class="fixed inset-0 z-10 flex items-center justify-center">
		<div class="absolute inset-0 bg-black opacity-50" on:click={() => (modalOpen = false)} />
		<div class="rounded bg-white p-8 shadow">
			<slot />
			<button class="mt-4" on:click={() => (modalOpen = false)}>Close</button>
		</div>
	</div>
{/if}
