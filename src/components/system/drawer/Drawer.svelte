<script lang="ts">
	import axios from 'axios';
	import Button from '../buttons/Button.svelte';
	import Collections from './Collections.svelte';
	import { goto } from '$app/navigation';
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
			goto(`/login`);
		}
	}
</script>

<div class="wrapper">
	<section>
		<Collections />
	</section>
	<button class="text-white" on:click={() => goto(`/profile`)}>Profile</button>
	<section class="mt-auto">
		<Button on:click={signOut}>SignOut</Button>
	</section>
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: #242734;
		text-align: center;
		width: 240px;
	}
	section {
		width: 100%;
		padding: 0 4px;
	}
</style>
