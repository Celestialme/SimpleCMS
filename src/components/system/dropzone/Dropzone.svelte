<script lang="ts">
	let dragging = false;
	let files: string | any[] = [];

	function handleDragOver(event: { preventDefault: () => void }) {
		event.preventDefault();
		dragging = true;
	}

	function handleDragLeave() {
		dragging = false;
	}
	function handleDrop(event: { preventDefault: () => void; dataTransfer: { files: any } }) {
		event.preventDefault();
		dragging = false;
		files = [...event.dataTransfer.files];
	}
</script>

<div
	class="rounded border-2 border-dashed p-4"
	on:dragover|preventDefault={handleDragOver}
	on:dragleave={handleDragLeave}
	on:drop|preventDefault={handleDrop}
>
	{#if dragging}
		<p>Drop files here</p>
	{:else}
		<p>Drag and drop files here or click to select files</p>
	{/if}
</div>

{#if files.length > 0}
	<ul>
		{#each files as file}
			<li>{file.name}</li>
		{/each}
	</ul>
{/if}
