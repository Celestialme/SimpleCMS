<script lang="ts">
	import { collectionValue, mode } from '@src/stores/store';
	import { credentials } from '@src/stores/load';
	import Drawer from '@src/components/system/drawer/Drawer.svelte';
	import Fields from '@src/components/Fields.svelte';
	import ControlPanel from '@src/components/ControlPanel.svelte';
	import EntryList from '@src/components/EntryList.svelte';
	import { collection } from '@src/collections';
	import type { LayoutServerData } from './$types';
	export let data: LayoutServerData;
	console.log(data);
	credentials.set(data.credentials);

	collection.subscribe((_) => {
		$collectionValue = {};
	});
</script>

<div class="flex">
	<Drawer />
	<div class="flex-grow overflow-auto max-h-screen">
		{#if $mode == 'view'}
			<EntryList />
		{:else if ['edit', 'create'].includes($mode)}
			<Fields />
		{/if}
	</div>
	<ControlPanel />
</div>
