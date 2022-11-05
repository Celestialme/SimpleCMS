<script lang="ts">
    export let self:any={};
    export let parent:any={};
    export let children:any=[];
    export let depth:number=0 //this is for main menu only
    export let level:number=0
    export let editing:boolean=false
    export let showLevelContent:boolean=false
    import {MenuCurrentChild} from "@root/stores/store"
    let expanded = false

$:console.log(depth)
</script>
<li>
    <div on:click={()=>expanded=!expanded}>
       {#if children?.length>0}
        <span>></span>
        {/if}
        <p style="margin-left:{20*level}px">{self?.name}</p>
        {#if level>0}
        <button on:click|preventDefault|stopPropagation={()=>{parent.children.splice(parent.children.indexOf(self),1);depth=level;editing=true;$MenuCurrentChild=self } } class="ml-auto btn btn-sm">❌</button>
        {/if}
        <button on:click|preventDefault|stopPropagation={()=>{depth=level;showLevelContent=!showLevelContent;$MenuCurrentChild=self;editing=true}} class=" btn btn-sm" class:ml-auto={level==0}>✎</button>
        <button on:click|preventDefault|stopPropagation={()=>{depth=level+1;showLevelContent=!showLevelContent;$MenuCurrentChild=self}} class="btn btn-sm">+</button>
    </div>
</li>
{#if children?.length && expanded}
{#each children as child}

<svelte:self children={child.children} level={level+1} self={child} parent={self} bind:editing bind:depth bind:showLevelContent/>
{/each}
{/if}
