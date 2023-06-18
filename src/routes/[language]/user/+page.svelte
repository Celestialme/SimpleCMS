<script lang="ts">
	import axios from 'axios';

	// Lucia
	import { page } from '$app/stores';
	const user = $page.data.user;

	// typesafe-i18n
	import LL from '@src/i18n/i18n-svelte';

	//import UserList from './UserList/UserList.svelte';
	import { toggleLeftSidebar } from '@src/stores/store';

	// Skeleton
	import { Avatar } from '@skeletonlabs/skeleton';
	import ModalEditAvatar from './ModalEditAvatar.svelte';
	import ModalEditForm from './ModalEditForm.svelte';
	import ModalTokenUser from './ModalTokenUser.svelte';
	import { modalStore } from '@skeletonlabs/skeleton';
	import type { ModalComponent, ModalSettings } from '@skeletonlabs/skeleton';

	// Modal Trigger - User Form
	function modalUserForm(): void {
		const modalComponent: ModalComponent = {
			// Pass a reference to your custom component
			ref: ModalEditForm,
			// Add your props as key/value pairs
			props: { background: 'bg-surface-100-800-token' },
			// Provide default slot content as a template literal
			slot: '<p>Edit Form</p>'
		};
		const d: ModalSettings = {
			type: 'component',
			// NOTE: title, body, response, etc are supported!
			title: 'Edit User Data',
			body: 'Modify your data and then press Save.',
			component: modalComponent,
			// Pass abitrary data to the component
			response: async (r: any) => {
				if (r) {
					const res = await axios.post('/api/user/editUser', {
						...r,
						id
					});

					if (res.status === 200) {
						await invalidateAll();
					}
				}
			}
		};
		modalStore.trigger(d);
	}

	// Modal Trigger - Edit avatar
	function modalEditAvatar(): void {
		const modalComponent: ModalComponent = {
			// Pass a reference to your custom component
			ref: ModalEditAvatar,
			props: {},
			// Add your props as key/value pairs
			// props: { background: 'bg-pink-500' },
			// Provide default slot content as a template literal
			slot: '<p>Edit Form</p>'
		};
		const d: ModalSettings = {
			type: 'component',
			// NOTE: title, body, response, etc are supported!
			title: 'Edit Avatar',
			body: 'Upload new Avatar Image und then press Save.',
			component: modalComponent,
			// Pass abitrary data to the component
			response: async (r: { dataURL: string }) => {
				if (r) {
					const formData = new FormData();
					formData.append('dataurl', r.dataURL);

					try {
						const res = await axios({
							method: 'post',
							url: '/api/user/editAvatar',
							data: formData,
							headers: { 'Content-Type': 'multipart/form-data' }
						});

						if (res.status === 200) {
							await invalidateAll();
							const resizedDataUrl = res.data.path;
							avatarSrc = resizedDataUrl;
						}
					} catch (err) {
						console.log(err);
						alert('Error uploading image');
					}
				}
			}
		};
		modalStore.trigger(d);
	}

	// Modal Trigger - Generate User Registration email Token
	function modalTokenUser(): void {
		const modalComponent: ModalComponent = {
			// Pass a reference to your custom component
			ref: ModalTokenUser,
			// Add your props as key/value pairs
			// props: {
			// 	background: 'bg-error-100-800-token',
			// 	buttonTextConfirm: 'bg-error-500'
			// },

			// Provide default slot content as a template literal
			slot: '<p>Edit Form</p>'
		};
		const d: ModalSettings = {
			type: 'component',
			// NOTE: title, body, response, etc are supported!
			title: 'Generate New User Registration token',
			body: 'Add User Email and select User Role & Duration, then press Send.',
			component: modalComponent,

			// Pass arbitrary data to the component
			response: (r: any) => {
				if (r) console.log('response:', r);
			}
		};
		modalStore.trigger(d);
	}

	function modalConfirm(): void {
		const d: ModalSettings = {
			type: 'confirm',
			title: 'Please Confirm User Deletion',
			body: 'This cannot be undone. Are you sure you wish to proceed?',
			// TRUE if confirm pressed, FALSE if cancel pressed
			response: (r: boolean) => {
				if (r) console.log('response:', r);
			},
			// Optionally override the button text
			buttonTextCancel: 'Cancel',
			buttonTextConfirm: 'Delete User'
		};
		modalStore.trigger(d);
	}

	let id = 'xyz_ID';
	let username = 'RKroells';
	let role = 'admin';
	let email = 'Info@asset-trade.de';

	let avatarSrc = user?.avatar;
	let showUserList = true;

	// TODO  Get hashed password
	let password = 'hash-password';

	//TODO: Get Roles from allowed user
	let roles: Record<string, boolean> = {
		Admin: true,
		Editor: false,
		User: false,
		Guest: false
	};

	function filter(role: string): void {
		roles[role] = !roles[role];
	}
</script>

<div class="align-centre mb-2 ml-2 mt-2 flex dark:text-white">
	<div class="flex items-center justify-between">
		{#if $toggleLeftSidebar === true}
			<button type="button" on:keydown on:click={() => toggleLeftSidebar.update((value) => !value)} class="btn-icon variant-ghost-surface mt-1">
				<iconify-icon icon="mingcute:menu-fill" width="24" />
			</button>
		{/if}
		<!-- Title  with icon -->
		<h1 class="{!$toggleLeftSidebar ? 'ml-2' : ''} h1 flex items-center gap-1">
			<iconify-icon icon="dashicons:welcome-widgets-menus" width="24" class="mr-1 text-red-500 sm:mr-2" /> User Profile
		</h1>
	</div>
</div>
<div class="m-2 grid grid-cols-1 grid-rows-2 gap-1 overflow-hidden md:grid-cols-2 md:grid-rows-1">
	<!-- Avatar with user info -->
	<div class="relative mx-2 mt-1 flex flex-col items-center justify-center gap-2">
		<Avatar src={avatarSrc ? '/api/' + avatarSrc : '/Default_User.svg'} initials="AV" rounded-none class="w-32" />

		<button on:click={modalEditAvatar} class="gradient-primary w-30 badge absolute top-1 text-white">{$LL.USER_Edit_Avatar()}</button>

		<div class="gradient-secondary badge mt-1 w-full max-w-xs text-white">
			{$LL.USER_ID()}:<span class="ml-2">{id}</span>
		</div>
		<div class="gradient-tertiary badge w-full max-w-xs text-white">
			{$LL.USER_Role()}:<span class="ml-2">{role}</span>
		</div>
	</div>

	<!-- user fields -->
	<form>
		<label
			>{$LL.USER_Username()}:
			<input bind:value={username} name="username" type="text" disabled class="input" />
		</label>
		<label
			>{$LL.USER_Email()}:
			<input bind:value={email} name="email" type="email" disabled class="input" />
		</label>
		<label
			>{$LL.USER_Password()}:
			<input bind:value={password} name="password" type="password" disabled class="input" />
		</label>
		<div class="my-2 flex flex-col justify-between gap-2 sm:flex-row sm:justify-between sm:gap-0">
			<button class="gradient-secondary btn btn-sm text-white md:w-auto" on:click={modalUserForm}>
				<iconify-icon icon="bi:pencil-fill" color="white" width="18" class="mr-1" />{$LL.USER_Edit()}:
			</button>
			<button on:click={modalConfirm} class="gradient-error btn btn-sm text-white"
				><iconify-icon icon="bi:trash3-fill" color="white" width="18" class="mr-1" />{$LL.USER_Delete()}</button
			>
		</div>
	</form>
</div>
<!-- admin area -->
<!-- {#if user?.role === 'admin'} -->
<div class="m-2 gap-2 border-t-2">
	<hr />
	<h2 class="mb-2 text-center md:text-left">{$LL.USER_AdminArea()}</h2>
	<div class="my-2 flex flex-col justify-between gap-2 sm:flex-row">
		<button class="gradient-secondary btn order-last text-white sm:order-1" on:click={() => (showUserList = !showUserList)}
			>{showUserList ? $LL.USER_ListCollapse() : $LL.USER_ListShow()}</button
		>
		<button on:click={modalTokenUser} class="btn-base gradient-primary w-30 btn order-2 text-white sm:order-2"
			><iconify-icon icon="material-symbols:mail" color="white" width="18" class="mr-1" />{$LL.USER_EmailToken()}</button
		>
	</div>

	{#if showUserList}
		userlist need to be fixed <!-- <UserList /> -->
	{/if}
</div>
<!-- {/if} -->
