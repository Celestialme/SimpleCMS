<script lang="ts">
     export let field:any=undefined
     export let value=""
     export let widgetValue
     $:widgetValue=value
</script>

<input type="text" bind:value name={field.title} class="input w-full ">

<style>

</style>