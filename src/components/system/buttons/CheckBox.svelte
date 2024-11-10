<script lang="ts">
	interface Props {
		checked?: boolean;
		icon: any;
		onchange?: any;
		class?: string;
	}

	let { checked = $bindable(), icon, onchange = () => {}, class: _class }: Props = $props();
</script>

<div
	class="flex min-h-[28px] h-[28px] w-[28px] min-w-[28px] items-center justify-center rounded-md border-2 border-gray-600 dark:border-[#3b426e] {_class}"
	onclick={(e) => {
		e.stopPropagation();
		checked = !checked;

		onchange();
	}}
>
	{#if checked}
		{@const SvelteComponent = icon}
		<SvelteComponent />
	{/if}
</div>
