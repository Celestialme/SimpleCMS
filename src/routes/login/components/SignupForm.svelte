<script lang="ts">
  import Icon from "@iconify/svelte";
  import env from "@root/env";
  import axios from "axios";
  import { Button, FloatingLabelInput } from "flowbite-svelte";
  import { credentials } from "@src/stores/store";
  import CMSLogo from "./icons/Logo.svelte";
  import { goto } from "$app/navigation";
  export let show: boolean = false;
  let showPassword: boolean = false;
  let forgot: boolean = false;
  let email = "";
  let password = "";
  let confirmPassword = "";

  async function signup() {
    if (password !==confirmPassword) return
    let resp = (
      await axios.post(
        `${env.API}/signup`,
        { email, password },
        {
          headers: {
            "content-type": "multipart/form-data",
          },
        }
      )
    ).data;
    if (resp.status == 200) {
      $credentials = resp;
      goto("/");
    }
  }
</script>

<div class:hide={!show} class="w-full duration-[2000ms] opacity-100">
  <div class="w-full lg:w-1/2 mx-auto p-4  mt-[15%] mb-[5%]">
    <div class="flex flex-row gap-2 mb-8">
      <CMSLogo className="w-10" fill="red" />

      <h1 class="text-3xl font-bold text-white">SimpleCMS - Sign Up</h1>
    </div>

    <!-- Email field -->

    <FloatingLabelInput
      id="floating_email"
      name="email"
      type="text"
      color="base"
      label="Email Address"
      class="mb-10 !text-white"
      bind:value={email}
    />

    <div class="relative">
      <!-- password field -->
      <FloatingLabelInput
        id="floating_password"
        name="password"
        label="Password"
        color="base"
        type={showPassword ? "text" : "password"}
        class="mb-4 !text-white"
        bind:value={password}
      />
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        class="absolute top-0 right-0"
        on:click={() => (showPassword = !showPassword)}
      >
        {#if showPassword}
          <Icon icon="bi:eye-fill" color="gray" width="32" height="32" />
        {:else}
          <Icon icon="bi:eye-slash-fill" color="base" width="32" height="32" />
        {/if}
      </div>
    </div>
    <div class="relative">
      <!-- confirm password field -->
      <FloatingLabelInput
        id="password_confirm"
        name="Password Confirm"
        label="Password Confirm"
        color="base"
        type={showPassword ? "text" : "password"}
        class="mb-4 !text-white"
        bind:value={confirmPassword}
      />
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        class="absolute top-0 right-0"
        on:click={() => (showPassword = !showPassword)}
      >
        {#if showPassword}
          <Icon icon="bi:eye-fill" color="gray" width="32" height="32" />
        {:else}
          <Icon icon="bi:eye-slash-fill" color="base" width="32" height="32" />
        {/if}
      </div>
    </div>
    <div class="buttons">
      <Button on:click={signup} color="light" class="mt-4">Sign Up</Button>

    </div>
  </div>
</div>

<style>
  .hide {
    transition: 0s;
    opacity: 0;
  }
</style>
