<script lang="ts">
	import type { PageData } from './$types';
	import { toggleLeftSidebar } from '@src/stores/store';
	import '@src/stores/store';
	import { roles } from '@src/collections/Auth';

	export let data: PageData;
	// console.log(data);

	// typesafe-i18n
	import LL from '@src/i18n/i18n-svelte';

	// Lucia
	import { page } from '$app/stores';
	import { invalidateAll } from '$app/navigation';
	const user = $page.data.user;

	// import UserList from './UserList/UserList.svelte';

	// Skeleton
	import { Avatar } from '@skeletonlabs/skeleton';
	import ModalEditAvatar from './ModalEditAvatar.svelte';
	import ModalEditForm from './ModalEditForm.svelte';
	import ModalTokenUser from './ModalTokenUser.svelte';
	import { modalStore } from '@skeletonlabs/skeleton';
	import type { ModalComponent, ModalSettings } from '@skeletonlabs/skeleton';

	let avatarSrc = user?.avatar;
	let showUserList = true;

	let id = user?.id;
	let username = user?.username;
	let role = user?.role;
	let email = user?.email;

	// TODO  Get hashed password
	let password = 'hash-password';

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
			// Pass arbitrary data to the component
			response: async (r: any) => {
				if (r) {
					const res = await fetch('/api/user/editUser', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ ...r, id })
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
			title: 'Edit your Avatar',
			body: 'Upload new Avatar Image und then press Save.',
			component: modalComponent,
			// Pass arbitrary data to the component
			response: async (r: { dataURL: string }) => {
				if (r) {
					const formData = new FormData();
					formData.append('dataurl', r.dataURL);

					try {
						const res = await fetch('/api/user/editAvatar', {
							method: 'POST',
							body: formData
						});

						if (res.status === 200) {
							const data = await res.json();
							await invalidateAll();
							const resizedDataUrl = data.path;
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
</script>

<div class="flex flex-col gap-1">
	<div class="flex items-center">
		<!-- hamburger -->
		{#if $toggleLeftSidebar === 'closed'}
			<button
				type="button"
				on:click={() => toggleLeftSidebar.click()}
				class="btn-icon variant-ghost-surface mt-1"
			>
				<iconify-icon icon="mingcute:menu-fill" width="24" />
			</button>
		{/if}

		<!-- Title  with icon -->
		<h1 class="h1 ml-2 flex items-center gap-1">User Profile</h1>
	</div>

	<div class="grid grid-cols-1 grid-rows-2 gap-1 overflow-hidden md:grid-cols-2 md:grid-rows-1">
		<!-- Avatar with user info -->
		<div class="relative mx-2 mt-1 flex flex-col items-center justify-center gap-2">
			<Avatar
				src={avatarSrc ? '/api/' + avatarSrc : '/Default_User.svg'}
				initials="AV"
				rounded-none
				class="w-32"
			/>

			<button
				on:click={modalEditAvatar}
				class="gradient-primary w-30 badge absolute top-8 text-white sm:top-4"
				>{$LL.USER_Edit_Avatar()}</button
			>

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
			<div class="my-2 flex flex-col justify-between gap-2 sm:flex-row sm:justify-between sm:gap-1">
				<button class="gradient-secondary btn text-white md:w-auto" on:click={modalUserForm}>
					<iconify-icon
						icon="bi:pencil-fill"
						color="white"
						width="18"
						class="mr-1"
					/>{$LL.USER_Edit()}:
				</button>
				<button on:click={modalConfirm} class="gradient-error btn text-white"
					><iconify-icon
						icon="bi:trash3-fill"
						color="white"
						width="18"
						class="mr-1"
					/>{$LL.USER_Delete()}</button
				>
			</div>
		</form>
	</div>
	<!-- admin area -->
	{#if user?.role == roles.admin}
		<div class="border-td mt-2 flex flex-col border-t-2">
			<p class="h2 mb-4 text-center text-3xl font-bold dark:text-white">{$LL.USER_AdminArea()}</p>
			<div class=" flex flex-col items-center justify-between gap-2 sm:flex-row">
				<button
					on:click={modalTokenUser}
					class="gradient-primary btn w-full text-white sm:max-w-xs"
				>
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
		</div>

		{#if showUserList}
			<!-- <UserList /> -->
			<p class="mt-3 border text-center">Display Available Users for edit/remove</p>
		{/if}
	{/if}
</div>
