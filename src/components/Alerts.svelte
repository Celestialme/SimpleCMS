<script lang="ts">
	import { Alert, Toast, Modal, Progressbar } from 'flowbite-svelte';
	import { fly } from 'svelte/transition';
	// Icons from https://icon-sets.iconify.design/
	import Icon from '@iconify/svelte';

	let alertMessage = 'SimpleCMS is getting better every day';
	let alertType = Alert;
	let alertIcon = 'mdi:tick-outline';
	let progress = 50;
	let alertTitle = 'SimpleCMS';
	let defaultModal = false;
</script>

{#if alertMessage}
	{#if alertType == Alert}
		<Alert
			dismissable
			accent
			shadow
			color="green"
			transition={fly}
			params={{ x: 200 }}
			class="absolute my-2 z-20  bottom-2 right-2"
		>
			<svelte:fragment slot="icon">
				<Icon icon={alertIcon} width="24" />
			</svelte:fragment>
			{alertMessage}
		</Alert>
		<div class="absolute my-2 z-20  bottom-2 right-2">
			<Progressbar progress="50" size="h-3.5" />
		</div>
	{:else if alertType == Toast}
		<Toast
			transition={fly}
			params={{ x: 200 }}
			color="green"
			class="absolute my-2 z-20  bottom-2 right-2"
		>
			<svelte:fragment slot="icon">
				<Icon icon={alertIcon} width="24" />
			</svelte:fragment>
			{alertMessage}
		</Toast>
	{:else if alertType == Modal}
		<Modal title={alertTitle} bind:open={defaultModal} autoclose>
			{alertMessage}
			<svelte:fragment slot="footer">
				<Button on:click={() => alert('Handle "success"')}>I accept</Button>
				<Button color="alternative">Decline</Button>
			</svelte:fragment>
		</Modal>
	{/if}
{/if}
