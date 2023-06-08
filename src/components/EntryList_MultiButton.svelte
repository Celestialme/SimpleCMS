<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { mode, switchSideBar, toggleRightSidebar } from '@src/stores/store';

	//console.log('mode', mode);

	const dispatch = createEventDispatcher();

	let listboxValue = 'create';
	let dropdownOpen = false;
	let { actionname, buttonClass, iconValue } = getButtonAndIconValues(listboxValue);

	function handleButtonClick() {
		mode.set('view');
		dispatch(listboxValue);
		dropdownOpen = false;
	}

	function handleOptionClick(value: string) {
		listboxValue = value;

		({ actionname, buttonClass, iconValue } = getButtonAndIconValues(listboxValue));
		dropdownOpen = false;
	}

	function getButtonAndIconValues(listboxValue: string) {
		let actionname = '';
		let buttonClass = '';
		let iconValue = '';

		switch (listboxValue) {
			case 'create':
				actionname = 'Create';
				buttonClass =
					'bg-gradient-to-br from-green-700 via-green-600 to-green-500 dark:bg-gradient-to-br dark:from-green-700 dark:via-green-600 dark:to-green-400 text-white hover:from-green-800 hover:via-green-700 hover:to-green-600 focus:from-green-800 focus:via-green-700 focus:to-green-600';
				iconValue = 'ic:round-plus';
				break;
			case 'publish':
				actionname = 'Publish';
				buttonClass = 'bg-blue-600 hover:bg-blue-600 focus:bg-blue-600 text-white';
				iconValue = 'bi:hand-thumbs-up-fill';
				break;
			case 'unpublish':
				actionname = 'Unpublish';
				buttonClass = 'bg-yellow-600 hover:bg-yellow-700 focus:bg-yellow-700 text-white';
				iconValue = 'bi:pause-circle';
				break;
			case 'schedule':
				actionname = 'Schedule';
				buttonClass = 'bg-pink-500 hover:bg-pink-600 focus:bg-pink-600 text-white';
				iconValue = 'bi:clock';
				break;
			case 'clone':
				actionname = 'Clone';
				buttonClass = 'bg-gray-500 hover:bg-gray-600 focus:bg-gray-600 text-white';
				iconValue = 'bi:clipboard-data-fill';
				break;
			case 'delete':
				actionname = 'Delete';
				buttonClass = 'bg-red-500 hover:bg-red-600 focus:bg-red-600 text-white';
				iconValue = 'bi:trash3-fill';
				break;
			default:
				actionname = '';
				buttonClass = '';
				iconValue = '';
				break;
		}

		return {
			actionname,
			buttonClass: `btn ${buttonClass} rounded-none w-36 justify-between`,
			iconValue
		};
	}
</script>

<div class="relative inline-flex rounded-md shadow">
	<button
		class={`inline-block rounded-l-full px-1 pl-4 font-medium uppercase leading-normal text-black transition duration-150 ease-in-out dark:text-white ${buttonClass}`}
		on:click|preventDefault={handleButtonClick}
		on:click={() => mode.set(listboxValue)}
	>
		<span class="flex items-center">
			<iconify-icon icon={iconValue} width="24" />
			<span class="ml-2">{actionname}</span>
		</span>
	</button>
	<div class="border-l-2 border-white" />
	<button
		class="inline-block rounded-r bg-gray-700 px-3 py-2 text-xs font-medium uppercase leading-normal text-white transition duration-150 ease-in-out hover:bg-gray-600 focus:bg-gray-600 focus:outline-none focus:ring-0 active:bg-gray-700"
		on:click|preventDefault={() => (dropdownOpen = !dropdownOpen)}
	>
		<iconify-icon icon="mdi:chevron-down" width="24" />
	</button>

	{#if dropdownOpen}
		<ul class="w-90 absolute right-12 top-12 z-10 divide-y-2 rounded-md bg-gray-800 py-1 text-white shadow-lg ring-1 ring-black ring-opacity-5">
			{#if listboxValue !== 'create'}
				<li>
					<!-- TODO: FIX Sidebar & RightSidebar Toggle -->
					<button
						class="w-full px-4 py-2 text-left hover:bg-green-600 focus:bg-green-600 focus:outline-none"
						on:click|preventDefault={() => handleOptionClick('create')}
						on:click={() => {
							mode.set('create');
							switchSideBar.update((value) => !value);
							toggleRightSidebar.update((value) => !value);
						}}
					>
						<span class="flex items-center">
							<iconify-icon icon="ic:round-plus" width="24" />
							<span class="ml-2">Create</span>
						</span>
					</button>
				</li>
			{/if}

			{#if listboxValue !== 'publish'}
				<li>
					<button
						class="w-full px-4 py-2 text-left hover:bg-blue-600 focus:bg-blue-600 focus:outline-none"
						on:click|preventDefault={() => handleOptionClick('publish')}
						on:click={() => mode.set('publish')}
					>
						<span class="flex items-center">
							<iconify-icon icon="bi:hand-thumbs-up-fill" width="24" />
							<span class="ml-2">Publish</span>
						</span>
					</button>
				</li>
			{/if}
			{#if listboxValue !== 'unpublish'}
				<li>
					<button
						class="w-full px-4 py-2 text-left hover:bg-yellow-600 focus:bg-yellow-600 focus:outline-none"
						on:click|preventDefault={() => handleOptionClick('unpublish')}
						on:click={() => mode.set('unpublish')}
					>
						<span class="flex items-center">
							<iconify-icon icon="bi:pause-circle" width="24" />
							<span class="ml-2">Unpublish</span>
						</span>
					</button>
				</li>
			{/if}

			{#if listboxValue !== 'schedule'}
				<li>
					<button
						class="w-full px-4 py-2 text-left hover:bg-pink-600 focus:bg-pink-600 focus:outline-none"
						on:click|preventDefault={() => handleOptionClick('schedule')}
						on:click={() => mode.set('schedule')}
					>
						<span class="flex items-center">
							<iconify-icon icon="bi:clock" width="24" />
							<span class="ml-2">Schedule</span>
						</span>
					</button>
				</li>
			{/if}

			{#if listboxValue !== 'clone'}
				<li>
					<button
						class="w-full px-4 py-2 text-left hover:bg-gray-600 focus:bg-gray-600 focus:outline-none"
						on:click|preventDefault={() => handleOptionClick('clone')}
						on:click={() => mode.set('clone')}
					>
						<span class="flex items-center">
							<iconify-icon icon="bi:clipboard-data-fill" width="24" />
							<span class="ml-2">Clone</span>
						</span>
					</button>
				</li>
			{/if}

			{#if listboxValue !== 'delete'}
				<li>
					<button
						class="w-full px-4 py-2 text-left hover:bg-red-600 focus:bg-red-600 focus:outline-none"
						on:click|preventDefault={() => handleOptionClick('delete')}
						on:click={() => mode.set('delete')}
					>
						<span class="flex items-center">
							<iconify-icon icon="bi:trash3-fill" width="24" />
							<span class="ml-2">Delete</span>
						</span>
					</button>
				</li>
			{/if}
		</ul>
	{/if}
</div>
