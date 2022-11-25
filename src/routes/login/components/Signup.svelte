<script lang="ts">
  export let active: undefined | 0 | 1 = undefined;
  import SignupIcon from "./icons/SignupIcon.svelte";
  import SignupForm from "./SignupForm.svelte";
</script>

<div
  class:active={active == 1}
  class:inactive={active !== undefined && active !== 1}
  class:hover={active == undefined || active == 0}
  on:click
  on:pointerenter
  class="flex  gap-3 justify-center items-center flex-col relative"
>
  <SignupForm show={active == 1} />
  <SignupIcon show={active == 0 || active == undefined} />
</div>

<style>
  div {
    --width: 0%;
    background: #242728;
    flex-grow: 1;
    width: var(--width);
    transition: 0.4s;
  }
  .active {
    --width: 90%;
  }
  .inactive {
    --width: 10%;
  }
  .hover:hover {
    border-top-left-radius: 5% 50%;
    border-bottom-left-radius: 5% 50%;
    width: calc(var(--width) + 10%);
  }
</style>
