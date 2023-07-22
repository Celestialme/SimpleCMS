<script lang="ts">
	import TanstackTable from '@src/components/TanstackTable.svelte';

	// typesafe-i18n
	import LL from '@src/i18n/i18n-svelte';

	// Skeleton
	import ModalTokenUser from './ModalTokenUser.svelte';
	import { modalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';

	// Modal Trigger - Generate User Registration email Token
	function modalTokenUser(): void {
		const modalComponent: ModalComponent = {
			// Pass a reference to your custom component
			ref: ModalTokenUser,

			// Provide default slot content as a template literal
			slot: '<p>Edit Form</p>'
		};
		const d: ModalSettings = {
			type: 'component',
			// NOTE: title, body, response, etc are supported!
			title: 'Generate a New User Registration Token',
			body: 'Add Users Email and select a Role & Validity, then press Send.',
			component: modalComponent,

			// Pass arbitrary data to the component
			response: (r: any) => {
				if (r) console.log('response:', r);
			}
		};
		modalStore.trigger(d);
	}

	let showUserList = true;
</script>

<div class="border-td mt-2 flex flex-col border-t-2">
	<p class="h2 mb-4 text-center text-3xl font-bold dark:text-white">{$LL.USER_AdminArea()}</p>
	<div class=" flex flex-col items-center justify-between gap-2 sm:flex-row">
		<button on:click={modalTokenUser} class="gradient-primary btn w-full text-white sm:max-w-xs">
			<iconify-icon icon="material-symbols:mail" color="white" width="18" class="mr-1" />
			{$LL.USER_EmailToken()}
		</button>
		<button
			on:click={() => (showUserList = !showUserList)}
			class="gradient-secondary btn w-full text-white sm:max-w-xs"
		>
			<iconify-icon icon="mdi:account-circle" color="white" width="18" class="mr-1" />
			{showUserList ? $LL.USER_ListCollapse() : $LL.USER_ListShow()}
		</button>
	</div>

	{#if showUserList}
		<!-- <UserList /> -->
		<p class="mt-3 border text-center">Display Available Users for edit/remove</p>
		table
		<TanstackTable />
	{/if}
</div>
