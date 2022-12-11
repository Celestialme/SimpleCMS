<script lang="ts">
	// Icons from https://icon-sets.iconify.design/
	import Icon from "@iconify/svelte";
	import { Button, FloatingLabelInput, Helper, Avatar } from "flowbite-svelte";
	//import { credentials } from "@src/stores/store";
	import CMSLogo from "../../components/icons/SimpleCMS_Logo.svelte";

	let showPassword: boolean = false;
	let forgot: boolean = false;
	let email = "";
	let password = "";
</script>

<div class="flex flex-row gap-2 mb-8">
	<CMSLogo
		className="w-10"
		fill="red"
	/>

	<h1 class="text-3xl font-bold">SimpleCMS - User Profile</h1>
</div>

<Avatar>user name</Avatar>
<!-- Email field -->

<div>
	<FloatingLabelInput
		id="floating_email"
		name="email"
		type="text"
		color="base"
		label="Email Address"
		class="mb-10"
	/>

	<div class="relative">
		<!-- password field -->
		<!-- type={showPassword ? "text" : "password"} -->
		<FloatingLabelInput
			id="floating_password"
			name="password"
			label="Password"
			color="base"
			autocomplete="current-password"
			class="mb-4"
			bind:value={password}
		/>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			class="absolute top-0 right-0"
			on:click={() => (showPassword = !showPassword)}
		>
			{#if showPassword}
				<Icon
					icon="bi:eye-fill"
					color="base"
					width="24"
				/>
			{:else}
				<Icon
					icon="bi:eye-slash-fill"
					color="gray"
					width="24"
				/>
			{/if}
		</div>
	</div>
	<div class="buttons">
		<!-- on:click={signin} -->
		<Button
			color="dark"
			class="mt-4">Sign In</Button
		>

		<Button
			on:click={() => (forgot = true)}
			outline
			color="light"
			class="mt-4 ml-4">Forgotten Password</Button
		>
	</div>
</div>

<form class="w-full lg:w-1/2 mx-auto p-4">
	<div class="flex flex-row gap-2 mb-8">
		<CMSLogo
			className="w-10"
			fill="red"
		/>
		<h1 class="text-3xl font-bold">Forgotten Password</h1>
	</div>

	<FloatingLabelInput
		id="floating_email"
		name="Email Address"
		type="text"
		label="Email Address"
		class="mb-4"
	/>
	<!-- bind:value={email} -->
	<Button
		type="submit"
		color="dark"
		class="mt-4">Send Password Reset Email</Button
	>
</form>
