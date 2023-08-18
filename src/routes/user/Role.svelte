<script lang="ts">
	import { roles } from '@src/collections/Auth';
	export let value: string;

	let classes = `${
		value === roles.admin.name
			? 'badge gradient-primary '
			: value === roles.developer.name
			? 'badge gradient-pink'
			: value === roles.editor.name
			? 'badge gradient-tertiary'
			: value === roles.user.name
			? 'badge gradient-secondary'
			: 'text-white'
	} rounded-full text-white`;
</script>

<div class={classes}>
	{#if value == roles.admin.name}
		<iconify-icon icon={roles.admin.icon} width="20" class="mr-2" /> {value}
	{:else if value == roles.developer.name}
		<iconify-icon icon={roles.developer.icon} width="20" class="mr-2" /> {value}
	{:else if value == roles.editor.name}
		<iconify-icon icon={roles.editor.icon} width="20" class="mr-2" /> {value}
	{:else if value == roles.user.name}
		<iconify-icon icon={roles.user.icon} width="20" class="mr-2" /> {value}
	{/if}
</div>
