<script lang="ts">
	import { toggleLeftSidebar } from '@src/stores/store';
</script>

<div class="mb-2 flex items-center">
	<!-- hamburger -->
	{#if $toggleLeftSidebar === 'closed'}
		<button
			type="button"
			on:click={() => toggleLeftSidebar.click()}
			class="btn-icon variant-ghost-surface"
		>
			<iconify-icon icon="mingcute:menu-fill" width="24" />
		</button>
	{/if}

	<!-- Title  with icon -->
	<h1 class="h1 ml-2 flex items-center">Graphql explorer goes here</h1>
</div>
