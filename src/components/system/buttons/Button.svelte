<script lang="ts">
	export let btnClass = '';
	export let size: keyof typeof sizeClasses = 'base';
	export let iconLeft = '';
	export let iconRight = '';
	export let iconColorLeft = '';
	export let iconColorRight = '';
	export let backgroundColor = 'gray';
	export let ariaLabel = '';

	let sizeClasses: { [key: string]: string } = {
		xs: 'px-1 py-1 text-xs',
		sm: 'px-3 py-2 text-sm',
		base: 'px-4 py-2 text-base',
		lg: 'px-6 py-3 text-lg',
		xl: 'px-8 py-4 text-xl'
	};

	let iconWidths: { [key: string]: string } = {
		xs: '12',
		sm: '14',
		base: '16',
		lg: '20',
		xl: '24'
	};

	let textColor = backgroundColor === 'white' ? 'black' : 'white';
	let hoverBackgroundColor =
		backgroundColor === 'white'
			? '#d9d9d9'
			: backgroundColor === 'gray'
			? '#4fdc4f'
			: backgroundColor === 'black'
			? '#333333'
			: backgroundColor === 'green'
			? '#00cc00'
			: backgroundColor;
</script>

<button
	aria-label={ariaLabel}
	class={`btn ${iconLeft || iconRight ? 'btn-icon' : ''} ${sizeClasses[size]} ${btnClass}`}
	style={`--backgroundColor: ${backgroundColor}; --textColor: ${textColor}; --hoverBackgroundColor: ${hoverBackgroundColor}`}
	on:click
>
	{#if iconLeft}
		<iconify-icon icon={iconLeft} width={iconWidths[size]} style={`color: ${iconColorLeft}`} />
	{/if}
	<slot />
	{#if iconRight}
		<iconify-icon icon={iconRight} width={iconWidths[size]} style={`color: ${iconColorRight}`} />
	{/if}
</button>

<style lang="postcss">
	button {
		background-color: var(--backgroundColor);
		color: var(--textColor);
		text-align: center;
		border-radius: 6px;
		transition: background-color 0.2s ease-in-out;
		user-select: none;
	}

	.circular-btn {
		border-radius: 9999px;
	}

	button:hover {
		background-color: var(--hoverBackgroundColor);
	}
	button:active {
		transform: scale(0.9);
	}
</style>
