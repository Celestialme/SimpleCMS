<script lang="ts">
	import Multibutton from './Multibutton.svelte';
	import type { PageData } from './$types';
	// typesafe-i18n
	import LL from '@src/i18n/i18n-svelte';

	// Skeleton
	import { Avatar } from '@skeletonlabs/skeleton';
	import ModalTokenUser from './ModalTokenUser.svelte';
	import { modalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	export let data: PageData;
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

	let showMoreUser = false;
	let showUserList = false;
	let showMoreToken = false;
	let showUsertoken = false;

	// TanstackFilter
	import TanstackFilter from '@src/components/TanstackFilter.svelte';
	let globalSearchValue = '';
	let searchShow = false;
	let filterShow = false;
	let columnShow = false;
	let density = 'normal';

	// TanstackTable
	import TanstackTable from '@src/components/TanstackTable.svelte';
	import { flexRender } from '@tanstack/svelte-table';

	// AdminUser Data
	import { onMount } from 'svelte';
	import Role from './Role.svelte';

	let tableData = [];
	// TODO: Fix to show all user not Users sessions
	onMount(async () => {
		tableData = data.allUsers;
		console.log(tableData);
	});

	// Display Columns
	let items = [
		{ header: 'ID', accessorKey: 'id', id: 'id' },
		// TODO: Add Avatar { header: 'Avatar', accessorKey: 'avatar', id: 'avatar', cell: (info) => flexRender(Avatar, { src: info.row.original.avatar, width: 'w-8' }) },
		{ header: 'Username', accessorKey: 'username', id: 'username' },
		{ header: 'Email', accessorKey: 'email', id: 'email' },
		{
			header: 'Role',
			accessorKey: 'role',
			id: 'role',
			cell: (info: any) => flexRender(Role, { value: info.getValue() })
		},
		{ header: 'Created At', accessorKey: 'createdAt', id: 'createdAt' },
		{ header: 'Updated At', accessorKey: 'updatedAt', id: 'updatedAt' }
	];

	// let tableDataUserToken = []

	// onMount(async () => {
	// 	tableData = data.user.;
	// 	//console.log(tableData);
	// });
	// Dummy Data and Items for Second Table (User Tokens)
	let tableDataUserToken = [
		{
			id: 1,
			username: 'user1',
			email: 'user1@example.com',
			role: 'User',
			token: 'token1',
			createdAt: '2023-08-14',
			updatedAt: '2023-08-14'
		},
		{
			id: 2,
			username: 'user2',
			email: 'user2@example.com',
			role: 'Admin',
			token: 'token2',
			createdAt: '2023-08-14',
			updatedAt: '2023-08-14'
		}
		// ... add more dummy data ...
	];

	let itemsUserToken = [
		{ header: 'ID', accessorKey: 'id', id: 'id' },
		{ header: 'Username', accessorKey: 'username', id: 'username' },
		{ header: 'Email', accessorKey: 'email', id: 'email' },
		{
			header: 'Role',
			accessorKey: 'role',
			id: 'role',
			cell: (info) => flexRender(Role, { value: info.getValue() })
		},
		{ header: 'Token', accessorKey: 'token', id: 'token' },
		{ header: 'Created At', accessorKey: 'createdAt', id: 'createdAt' },
		{ header: 'Updated At', accessorKey: 'updatedAt', id: 'updatedAt' }
	];
</script>

<div class="border-td mt-2 flex flex-col border-t-2">
	<p class="h2 my-2 text-center text-3xl font-bold dark:text-white">{$LL.USER_AdminArea()}</p>
	<div class=" flex flex-col items-center justify-between gap-2 sm:flex-row">
		<!-- Email Token -->
		<button on:click={modalTokenUser} class="gradient-primary btn w-full text-white sm:max-w-xs">
			<iconify-icon icon="material-symbols:mail" color="white" width="18" class="mr-1" />
			{$LL.USER_EmailToken()}
		</button>

		<!-- Show User Token -->
		<button
			on:click={() => (showUsertoken = !showUsertoken)}
			class="gradient-tertiary btn w-full text-white sm:max-w-xs"
		>
			<iconify-icon icon="material-symbols:key-outline" color="white" width="18" class="mr-1" />
			{showUsertoken ? 'Hide User Token' : 'Show User Token'}
		</button>

		<!-- Show User List -->
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
		<div class="flex flex-col sm:flex-row items-center justify-between my-2">
			<div class="hidden sm:flex">
				<TanstackFilter
					bind:globalSearchValue
					bind:searchShow
					bind:filterShow
					bind:columnShow
					bind:density
				/>
			</div>

			<div class="flex items-center justify-between gap-2">
				<button
					type="button"
					on:keydown
					on:click={() => (showMoreUser = !showMoreUser)}
					class="btn-icon variant-ghost-surface sm:hidden"
				>
					<iconify-icon icon="material-symbols:filter-list-rounded" width="30" />
				</button>

				<Multibutton />
			</div>

			{#if showMoreUser}
				<div class="sm:hidden">
					<TanstackFilter
						bind:globalSearchValue
						bind:searchShow
						bind:filterShow
						bind:columnShow
						bind:density
					/>
				</div>
			{/if}
		</div>
		{#if tableData.length > 0}
			<TanstackTable
				data={tableData}
				{items}
				{tableData}
				dataSourceName="AdminArea"
				bind:globalSearchValue
				bind:filterShow
				bind:columnShow
				bind:density
			/>
		{/if}
	{/if}

	{#if showUsertoken}
		<!-- User Token invites -->
		<div class="flex flex-col sm:flex-row items-center justify-between my-2">
			<div class="hidden sm:flex">
				<TanstackFilter
					bind:globalSearchValue
					bind:searchShow
					bind:filterShow
					bind:columnShow
					bind:density
				/>
			</div>

			<div class="flex items-center justify-between gap-2">
				<button
					type="button"
					on:keydown
					on:click={() => (showMoreToken = !showMoreToken)}
					class="btn-icon variant-ghost-surface sm:hidden"
				>
					<iconify-icon icon="material-symbols:filter-list-rounded" width="30" />
				</button>

				<Multibutton />
			</div>

			{#if showMoreToken}
				<div class="sm:hidden">
					<TanstackFilter
						bind:globalSearchValue
						bind:searchShow
						bind:filterShow
						bind:columnShow
						bind:density
					/>
				</div>
			{/if}
		</div>
		{#if tableData.length > 0}
			<TanstackTable
				data={tableDataUserToken}
				items={itemsUserToken}
				{tableData}
				dataSourceName="AdminArea"
				bind:globalSearchValue
				bind:filterShow
				bind:columnShow
				bind:density
			/>
		{/if}
	{/if}
</div>
