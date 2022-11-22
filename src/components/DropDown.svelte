<script lang="ts">
    export let data:Array<any>=[];
    export let selected;
    export let display:any
</script>
<div class="container">
{#each data as item}
{#await display(item)}
<p>...loading</p>
{:then data}
<p on:click|preventDefault={()=>selected=item}>{data}</p>
{/await}
{/each}

</div>

<style>
    .container{
        position: absolute;
        top: 100%;
        left:0
    }
    p{
        padding:10px;

    }
</style>
