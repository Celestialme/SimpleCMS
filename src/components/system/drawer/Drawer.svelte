<script lang="ts">
	import { credentials } from '@src/stores/load';
	import axios from 'axios';
	import Button from '../buttons/Button.svelte';
	import Collections from './Collections.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	async function signOut() {
		let resp = (
			await axios.post(
				`/api/auth`,
				{ authType: 'signOut' },
				{
					headers: {
						'content-type': 'multipart/form-data'
					}
				}
			)
		).data;
		if (resp.status == 200) {
			$credentials = resp;
			goto(`/${$page.params.language}/login`);
		}
	}
</script>

<div class="flex flex-col h-screen bg-[#242734] text-center">
	<section>
		<Collections />
	</section>
	<section class="mt-auto">
		<Button on:click={signOut}>SignOut</Button>
	</section>
</div>

<style>
	section {
		width: 240px;
		padding: 0 4px;
	}
</style>
