<script lang="ts">
	export let btnClass = '';
</script>

<button on:click class={btnClass}>
	<slot />
</button>

<style>
	button {
		background-color: gray;
		color: white;
		border: none;
		padding: 10px 30px;
		text-align: center;
		border-radius: 6px;
		transition: background-color 0.2s ease-in-out;
		user-select: none;
	}
	button:hover {
		background-color: #4fdc4f;
	}
	button:active {
		transform: scale(0.9);
	}
</style>
