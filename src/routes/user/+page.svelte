<script lang="ts">
	import type { PageData } from './$types';
	import '@src/stores/store';
	import { roles } from '@src/collections/Auth';

	import PageTitle from '@src/components/PageTitle.svelte';

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

	import { getModalStore } from '@skeletonlabs/skeleton';

	const modalStore = getModalStore();
	import type { ModalComponent, ModalSettings } from '@skeletonlabs/skeleton';
	import AdminArea from './AdminArea.svelte';
	import { writable } from 'svelte/store';

	let avatarSrc = writable(user?.avatar);

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
			props: { avatarSrc },

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
			component: modalComponent
			// Pass arbitrary data to the component
			// response: async (r: { dataURL: string }) => {
			// 	if (r) {
			// 		const formData = new FormData();
			// 		formData.append('dataurl', r.dataURL);

			// 		try {
			// 			const res = await fetch('/api/user/editAvatar', {
			// 				method: 'POST',
			// 				body: formData
			// 			});

			// 			if (res.status === 200) {
			// 				const data = await res.json();
			// 				await invalidateAll();
			// 				const resizedDataUrl = data.path;
			// 				avatarSrc = resizedDataUrl;
			// 			}
			// 		} catch (err) {
			// 			console.log(err);
			// 			alert('Error uploading image');
			// 		}
			// 	}
			// }
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
	<!-- TODO: fix TypeScript, as Icon is already optional? -->
	<PageTitle name="User Profile" icon="" />

	<div class="grid grid-cols-1 grid-rows-2 gap-1 overflow-hidden md:grid-cols-2 md:grid-rows-1">
		<!-- Avatar with user info -->
		<div class="relative flex flex-col items-center justify-center gap-1">
			<Avatar
				src={$avatarSrc ? $avatarSrc : '/Default_User.svg'}
				initials="AV"
				rounded-none
				class="w-32"
			/>

			<!-- edit button -->
			<button
				on:click={modalEditAvatar}
				class="gradient-primary w-30 badge absolute top-8 text-white sm:top-4"
				>{$LL.USER_Edit_Avatar()}</button
			>
			<!--User ID -->
			<div class="gradient-secondary badge mt-1 w-full max-w-xs text-white">
				{$LL.USER_ID()}:<span class="ml-2">{id}</span>
			</div>
			<!-- Role -->
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
			<div class="mt-2 flex flex-col justify-between gap-2 sm:flex-row sm:justify-between sm:gap-1">
				<!-- Edit Modal Button -->
				<button class="gradient-secondary btn text-white md:w-auto" on:click={modalUserForm}>
					<iconify-icon
						icon="bi:pencil-fill"
						color="white"
						width="18"
						class="mr-1"
					/>{$LL.USER_Edit()}:
				</button>
				<!-- Delete Modal Button -->
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
		<AdminArea {data} />
	{/if}
</div>
