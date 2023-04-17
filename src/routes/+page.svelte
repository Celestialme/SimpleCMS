<script lang="ts">
	import { goto } from '$app/navigation';
	import axios from 'axios';
	import { onMount } from 'svelte';
	import { credentials, mode } from '@src/stores/store';
	import Drawer from '@src/components/system/drawer/Drawer.svelte';
	import Fields from '@src/components/Fields.svelte';
	import ControlPanel from '@src/components/ControlPanel.svelte';
	import EntryList from '@src/components/EntryList.svelte';
	onMount(() => {
		axios
			.post(
				`/api/auth`,
				{ sessionID: $credentials.session, authType: 'validate' },
				{
					headers: {
						'content-type': 'multipart/form-data'
					}
				}
			)
			.then((response) => {
				if (response.data.status == 200) {
					$credentials = response.data;
				} else {
					goto('/login');
				}
			});
	});
</script>

<div class="flex">
	<Drawer />
	<div class="flex-grow overflow-auto max-h-screen">
		{#if $mode == 'view'}
			<EntryList />
		{:else if $mode == 'edit'}
			<Fields />
		{/if}
	</div>
	<ControlPanel />
</div>
