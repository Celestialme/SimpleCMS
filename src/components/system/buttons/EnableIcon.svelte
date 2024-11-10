<script lang="ts">
	interface Props {
		checked?: boolean;
		icon: string;
		class?: string;
	}

	let { checked = $bindable(), icon, class: _class, ...props }: Props = $props();
</script>

<iconify-icon
	{props}
	{icon}
	class="icon text-gray-400 {_class}"
	width="24"
	class:checked
	onclick={() => (checked = !checked)}
></iconify-icon>

<style>
	.icon {
		cursor: pointer;
	}
	.checked {
		color: rgb(4, 203, 4);
	}
</style>
