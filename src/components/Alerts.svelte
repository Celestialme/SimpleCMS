<script lang="ts">
	import { fly } from 'svelte/transition';

	// Skeleton
	import { Alert } from '@skeletonlabs/skeleton';
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import { Toast, toastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	import { Modal, modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';

	// Icons from https://icon-sets.iconify.design/
	import Icon from '@iconify/svelte';

	let alertMessage = 'SimpleCMS is getting better every day';
	let alertType = Alert;
	let alertIcon = 'mdi:tick-outline';
	let progress = '10%';
	let alertTitle = 'SimpleCMS';
	let defaultModal = false;

	function triggerToast(): void {
		const t: ToastSettings = {
			message: '👋 Hello and welcome to Skeleton.'
			// Optional: Presets for primary | secondary | tertiary | warning
			//preset: 'primary',
			// Optional: The auto-hide settings
			//autohide: true,
			//timeout: 5000,
			// Optional: Adds a custom action button
			//action: {
			//	label: 'Greeting',
			//	response: () => alert('Hello, Skeleton')
			//}
		};
		toastStore.trigger(t);
	}
</script>

{#if alertMessage}
	{#if alertType == Alert}
		<Alert
			transition={fly}
			params={{ x: 200 }}
			class="absolute bottom-2 right-3 z-20 my-2 bg-gradient-to-br  from-lime-700 via-lime-600 to-lime-500 text-white shadow-xl"
		>
			<button on:click={() => (alertMessage = '')} class="btn btn-sm absolute top-0 right-0"
				>X</button
			>
			<svelte:fragment slot="lead">
				<Icon icon={alertIcon} width="24" color="white" />
			</svelte:fragment>
			{alertMessage}

			<ProgressBar value={50} max={100} class="mt-3" />
		</Alert>
	{:else if alertType == Toast}
		<Toast />
		<!-- <Toast
			transition={fly}
			params={{ x: 200 }}
			class="absolute bottom-2 right-2  z-20 my-2"
		>
			<svelte:fragment slot="icon">
				<Icon icon={alertIcon} width="24" />
			</svelte:fragment>
			{alertMessage}
		</Toast> -->
	{:else if alertType == Modal}
		<Modal title={alertTitle} bind:open={defaultModal} autoclose>
			{alertMessage}
			<svelte:fragment slot="footer">
				<button on:click={() => alert('Handle "success"')}>I accept</button>
				<button color="alternative">Decline</button>
			</svelte:fragment>
		</Modal>
	{/if}
{/if}
