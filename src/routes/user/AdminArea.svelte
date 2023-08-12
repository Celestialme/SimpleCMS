<script lang="ts">
	import Multibutton from './Multibutton.svelte';
	import type { PageData } from './$types';
	// typesafe-i18n
	import LL from '@src/i18n/i18n-svelte';

	// Skeleton
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

	let showMore = false;

	// TanstackFilter
	import TanstackFilter from '@src/components/TanstackFilter.svelte';
	let globalSearchValue = '';
	let searchShow = false;
	let filterShow = false;
	let columnShow = false;
	let density = 'normal';

	// TanstackTable
	import TanstackTable from '@src/components/TanstackTable.svelte';

	// AdminUser Data
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	const user = $page.data.user;
	let tableData = [];
	//let data = user;
	//console.log('auth_data', user);
	// use data here

	// let data = [
	// 	{
	// 		_id: '9rK2Lr9pLJjS5CK',
	// 		email: 'info@asset-trade.de',
	// 		role: 'admin',
	// 		username: 'Rar9',
	// 		createdAt: new Date('2023-07-18T19:39:31.420Z'),
	// 		updatedAt: new Date('2023-07-20T12:01:14.619Z'),
	// 		__v: 0,
	// 		authMethod: 'password'
	// 	},
	// 	{
	// 		_id: '2',
	// 		email: 'bob@example.com',
	// 		role: 'viewer',
	// 		username: 'Bob',
	// 		createdAt: new Date('2023-07-18T19:39:31.420Z'),
	// 		updatedAt: new Date('2023-07-20T12:01:14.619Z'),
	// 		__v: 0,
	// 		authMethod: 'password'
	// 	},
	// 	{
	// 		_id: '3',
	// 		email: 'charlie@example.com',
	// 		role: 'viewer',
	// 		username: 'Charlie',
	// 		createdAt: new Date('2023-07-18T19:39:31.420Z'),
	// 		updatedAt: new Date('2023-07-20T12:01:14.619Z'),
	// 		__v: 0,
	// 		authMethod: 'password'
	// 	},
	// 	{
	// 		_id: '4',
	// 		email: 'test@example.com',
	// 		role: 'viewer',
	// 		username: 'TestCharlie',
	// 		createdAt: new Date('2023-07-18T19:39:31.420Z'),
	// 		updatedAt: new Date('2023-07-20T12:01:14.619Z'),
	// 		__v: 0,
	// 		authMethod: 'password'
	// 	},
	// 	{
	// 		_id: '5',
	// 		email: 'test@example.com',
	// 		role: 'viewer',
	// 		username: 'TestCharlie',
	// 		createdAt: new Date('2023-07-18T19:39:31.420Z'),
	// 		updatedAt: new Date('2023-07-20T12:01:14.619Z'),
	// 		__v: 0,
	// 		authMethod: 'password'
	// 	}
	// ];
	onMount(async () => {
		tableData = data.allUsers;
		console.log(tableData);
	});
	// TODO: Update cookie if items change
	let items = [
		// { header: 'ID', accessorKey: '_id', id: '_id' },
		{ header: 'ID', accessorKey: 'id', id: 'id' },
		{ header: 'Username', accessorKey: 'username', id: 'username' },
		{ header: 'Email', accessorKey: 'email', id: 'email' },
		{ header: 'Role', accessorKey: 'role', id: 'role' },
		{ header: 'Created At', accessorKey: 'createdAt', id: 'createdAt' },
		{ header: 'Updated At', accessorKey: 'updatedAt', id: 'updatedAt' }
	];

	let showUserList = true;
</script>

<div class="border-td mt-2 flex flex-col border-t-2">
	<p class="h2 my-2 text-center text-3xl font-bold dark:text-white">{$LL.USER_AdminArea()}</p>
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
					on:click={() => (showMore = !showMore)}
					class="btn-icon variant-ghost-surface sm:hidden"
				>
					<iconify-icon icon="material-symbols:filter-list-rounded" width="30" />
				</button>

				<Multibutton />
			</div>

			{#if showMore}
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
</div>
