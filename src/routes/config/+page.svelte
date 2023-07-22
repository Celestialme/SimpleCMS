<script lang="ts">
	import PageTitle from '@src/components/PageTitle.svelte';
</script>

<div class="mb-2 flex items-center">
	<PageTitle name="System Configuration" />
</div>

<h2 class="ml-2 mt-8 text-center text-primary-500">Select what you need to customize</h2>
<div class="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
	<!-- Collection -->
	<a href="/collection" class="btn variant-outline-secondary gap-2 py-6">
		<iconify-icon icon="mingcute:menu-fill" width="24" class="text-tertiary-600" />
		<p class="uppercase">Sidebar Menu</p>
	</a>

	<!-- builder -->
	<a href="/builder" class="btn variant-outline-secondary gap-2 py-6">
		<iconify-icon icon="fluent-mdl2:build-definition" width="24" class="text-tertiary-600" />
		<p class="uppercase">Collection Builder</p>
	</a>

	<!-- builder2 -->
	<a href="/builder2" class="btn variant-outline-secondary gap-2 py-6">
		<iconify-icon icon="fluent-mdl2:build-definition" width="24" class="text-error-600" />
		<p class="uppercase">Collection Builder 2</p>
	</a>

	<!-- profile -->
	<a href="/profile" class="btn variant-outline-secondary gap-2 py-6">
		<iconify-icon icon="iconamoon:profile-circle" width="24" class="text-error-600" />
		<p class="uppercase">Profile</p>
	</a>

	<!-- upload -->
	<a href="/upload" class="btn variant-outline-secondary gap-2 py-6">
		<iconify-icon icon="bi:images" width="24" class="text-error-600" />
		<p class="uppercase">Upload Tester</p>
	</a>

	<!-- Editor -->
	<a href="/imageEditor" class="btn variant-outline-secondary gap-2 py-6">
		<iconify-icon icon="bi:images" width="24" class="text-error-600" />
		<p class="uppercase">Image Editor</p>
	</a>

	<!-- Graphql -->
	<a href="/graphiql" class="btn variant-outline-secondary gap-2 py-6">
		<iconify-icon icon="teenyicons:graphql-solid" width="24" class="text-error-600" />
		<p class="uppercase">Graphql Editor</p>
	</a>
</div>
