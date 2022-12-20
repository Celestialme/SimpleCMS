<script lang="ts">
	import { Alert, Toast, Modal, Progressbar, CloseButton } from 'flowbite-svelte';
	import { fly } from 'svelte/transition';
	// Icons from https://icon-sets.iconify.design/
	import Icon from '@iconify/svelte';

	let alertMessage = 'SimpleCMS is getting better every day';
	let alertType = Alert;
	let alertIcon = 'mdi:tick-outline';
	let progress = '10%';
	let alertTitle = 'SimpleCMS';
	let defaultModal = false;
</script>

{#if alertMessage}
	{#if alertType == Alert}
		<!-- <div
			class="absolute bottom-1 right-2 mb-4 flex  bg-gradient-to-br from-lime-600 via-lime-500 to-lime-300 p-4 shadow-xl"
			role="alert"
		>
			<Icon icon={alertIcon} width="24" color="white" />
			<div class="ml-3 text-lg font-medium text-white">
				{alertMessage}
			</div>

			<CloseButton on:click={() => (alertMessage = false)} />
		</div>
		
		<div class="absolute -mt-4 h-1.5 w-full bg-gray-200 dark:bg-gray-800">
			<div class="h-1.5 bg-gray-900 dark:bg-green-500" style="width: {progress}" />
		</div> -->
		<Alert
			dismissable
			shadow
			accent
			color="white"
			transition={fly}
			params={{ x: 200 }}
			class="absolute bottom-2 right-3 z-20 my-2 bg-gradient-to-br  from-lime-700 via-lime-600 to-lime-500 text-white shadow-xl"
		>
			<svelte:fragment slot="icon">
				<Icon icon={alertIcon} width="24" color="white" />
			</svelte:fragment>
			{alertMessage}

			<Progressbar color="green" progress="50" size="h-2" slot="extra" class="mt-2 " />
		</Alert>
	{:else if alertType == Toast}
		<Toast
			transition={fly}
			params={{ x: 200 }}
			color="green"
			class="absolute bottom-2 right-2  z-20 my-2"
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
