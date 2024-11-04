<script lang="ts">
	import { collection, saveFunction } from '@src/stores/load';
	import Button from './system/buttons/Button.svelte';
	import { collectionValue, entryData, mode } from '@src/stores/store';
	import { saveFormData, toISOString } from '@src/utils/utils';
	import { page } from '$app/stores';
	import type { User } from '@src/auth/types';
	import XIcon from './system/icons/XIcon.svelte';
	let _saveFunction;
	_saveFunction = $saveFunction.fn = async () => {
		await saveFormData({ data: $collectionValue });
		mode.set('view');
	};
	$saveFunction.reset = () => {
		$saveFunction.fn = _saveFunction;
	};
	let user: User = $page.data.user;

	let schedule = $state({
		error: '',
		showSchedule: false,
		scheduleTime: $entryData._scheduled ? toISOString(new Date($entryData._scheduled)) : '',
		setSchedule() {
			if (new Date(schedule.scheduleTime) < new Date()) {
				schedule.error = 'Cannot schedule in the past';
				return;
			}
			schedule.showSchedule = false;

			if (!schedule.scheduleTime) {
				$collectionValue._scheduled = () => false;
			} else {
				$collectionValue._scheduled = () => new Date(schedule.scheduleTime).getTime();
			}
		}
	});
</script>

<div
	class="wrapper max-md:!h-auto max-md:!w-screen max-md:!max-w-full max-md:absolute max-md:top-[calc(100vh-45px)]"
>
	{#if $collection.permissions?.[user.role]?.write != false}
		<Button class="max-md:hidden" on:click={$saveFunction.fn}>SAVE</Button>
		<iconify-icon
			onclick={() => (schedule.showSchedule = !schedule.showSchedule)}
			icon="mdi:calendar-clock"
			class="mt-[15px] cursor-pointer"
			class:text-white={!$entryData._scheduled}
			class:future={$entryData._scheduled && new Date($entryData._scheduled) > new Date()}
			class:past={$entryData._scheduled && new Date($entryData._scheduled) < new Date()}
			width="40"
		></iconify-icon>
	{/if}
</div>

{#if schedule.showSchedule}
	<div
		class="p-4 w-[400px] max-w-full flex flex-col items-center justify-start h-[200px] rounded-md bg-white border-solid border-gray-500 border-2 fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
	>
		<XIcon
			on:click={() => (schedule.showSchedule = false)}
			class="absolute top-2 right-2 cursor-pointer"
		></XIcon>
		<input type="datetime-local" bind:value={schedule.scheduleTime} />
		<span class="text-red-500">{schedule.error}</span>
		<Button on:click={() => schedule.setSchedule()} class="mt-auto">Schedule</Button>
	</div>
{/if}

<style>
	.wrapper {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		flex-direction: column;
		max-width: 200px;
		height: 100vh;
		background-color: #242734;
		flex-shrink: 2;
		flex-grow: 1;
		width: 30vw;
		margin-top: auto;
	}
	.future {
		color: #ff7d2e;
	}
	.past {
		color: #00fd5d;
	}
</style>
