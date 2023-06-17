<button on:click class="{$$props.class} ">
	<slot />
</button>

<style>
	button {
		border: none;
		padding: 10px 30px;
		text-align: center;
		border-radius: 6px;
		transition: background-color 0.2s ease-in-out;
		user-select: none;
		border: 1px solid gray;
	}
	button:hover {
		background-color: #4fdc4f;
	}
	button:active {
		transform: scale(0.9);
	}
</style>
