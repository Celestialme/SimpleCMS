<script lang="ts">
	// Icons from https://icon-sets.iconify.design/
	import Icon from '@iconify/svelte';
	import {
		Button,
		ButtonGroup,
		FloatingLabelInput,
		Helper,
		Avatar,
		Tooltip
	} from 'flowbite-svelte';
	//import { credentials } from "@src/stores/store";
	import CMSLogo from '../../components/icons/SimpleCMS_Logo.svelte';

	let showPassword: boolean = false;
	let forgot: boolean = false;
	let email = '';
	let password = '';

	// define default
	let color = 'blue';
	const values = [0, [0]];
</script>

<div class="flex flex-row gap-2 mb-8">
	<CMSLogo className="w-10" fill="red" />

	<h1 class="text-3xl text-light font-bold">SimpleCMS - User Profile</h1>
</div>

{#if !forgot}
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
			<div class="absolute top-0 right-0" on:click={() => (showPassword = !showPassword)}>
				{#if showPassword}
					<Icon icon="bi:eye-fill" color="base" width="24" />
				{:else}
					<Icon icon="bi:eye-slash-fill" color="gray" width="24" />
				{/if}
			</div>
		</div>
		<div class="buttons">
			<!-- on:click={signin} -->
			<Button gradient {color} class="mt-4">Sign In</Button>

			<Button on:click={() => (forgot = true)} outline color="light" class="mt-4 ml-4"
				>Forgotten Password</Button
			>
		</div>
	</div>
{:else}
	<!-- Forgotten Password -->
	<form class="w-full p-4">
		<div class="flex flex-row gap-2 mb-8">
			<CMSLogo className="w-10" fill="red" />
			<h1 class="text-3xl text-light font-bold">Forgotten Password</h1>
		</div>

		<FloatingLabelInput
			id="floating_email"
			name="Email Address"
			type="text"
			label="Email Address"
			class="mb-4"
		/>
		<!-- bind:value={email} -->
		<Button type="submit" {color} class="mt-4">Send Password Reset Email</Button>
	</form>
{/if}

<!-- Settings -->

<div class="text-dark dark:text-white text-2xl font-bold mb-2">Settings:</div>

<Avatar size="lg" class="text-dark dark:text-white text-center">user name</Avatar>

<div class="text-xl text-dark font-bold dark:text-white my-2">Appearance:</div>
<div class="mb-2 p-3 inline-block rounded-full border-2 border-white">
	<ButtonGroup class="space-x-px" mandatory bind:value={values[0]}>
		<Button pill gradient {color} value="light">Light</Button>
		<Button pill gradient {color} value="light">Dark</Button>
		<Button pill gradient {color} value="auto">Auto</Button>
	</ButtonGroup>
</div>
<Helper>Enables Darkmode for the admin interface.</Helper>

<div class="text-xl text-dark font-bold dark:text-white my-2">Accent color:</div>
<div class="mb-2 p-3 inline-block rounded-full border-2 border-white ">
	<Button
		pill
		class="!p-2 h-8 w-8 border dark:border-white"
		gradient
		color="red"
		value="red"
	/><Tooltip placement="bottom">Default Red</Tooltip>
	<Button
		pill
		class="!p-2 h-8 w-8 border dark:border-white"
		gradient
		color="blue"
		value="blue"
	/><Tooltip placement="bottom">Blue</Tooltip>
	<Button
		pill
		class="!p-2 h-8 w-8 border dark:border-white"
		gradient
		color="green"
		value="green"
	/><Tooltip placement="bottom">Green</Tooltip>
	<Button
		pill
		class="!p-2 h-8 w-8 border dark:border-white"
		gradient
		color="cyan"
		value="cyan"
	/><Tooltip placement="bottom">Cyan</Tooltip>
	<Button
		pill
		class="!p-2 h-8 w-8 border dark:border-white"
		gradient
		color="teal"
		value="teal"
	/><Tooltip placement="bottom">Teal</Tooltip>
	<Button
		pill
		class="!p-2 h-8 w-8 border dark:border-white"
		gradient
		color="lime"
		value="lime"
	/><Tooltip placement="bottom">Lime</Tooltip>
	<Button
		pill
		class="!p-2 h-8 w-8 border dark:border-white"
		gradient
		color="pink"
		value="pink"
	/><Tooltip placement="bottom">Pink</Tooltip>
	<Button
		pill
		class="!p-2 h-8 w-8 border dark:border-white"
		gradient
		color="purple"
		value="purple"
	/><Tooltip placement="bottom">Purple</Tooltip>
	<Button pill class="!p-2 h-8 w-8 border dark:border-white" gradient color="alternative" />
	<Tooltip placement="bottom">Custom</Tooltip>
</div>
<Helper>Sets the Accent Theme Color</Helper>
