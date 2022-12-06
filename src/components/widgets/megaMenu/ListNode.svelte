<script lang="ts">
    export let self:any={};
    export let parent:any={};
    export let children:any=[];
    export let depth:number=0 //this is for main menu only
    export let level:number=0
    export let editing:boolean=false
    export let showLevelContent:boolean=false
    import {MenuCurrentChild} from "@src/stores/store"
    import { Button } from "flowbite-svelte";
    let expanded = false

</script>
<li>
    <div on:click={()=>expanded=!expanded}>
       
        <p style="margin-left:{20*level}px" class="pl-[20px] relative text-black">
            {#if children?.length>0}
                 <div  class="arrow" class:expanded/>
             {/if}
            {self?.name}
        </p>
        {#if level>0}
        <Button on:click={()=>{parent.children.splice(parent.children.indexOf(self),1);depth=level;editing=true;$MenuCurrentChild=self } } class="ml-auto btn btn-sm">❌</Button>
        {/if}
        <Button on:click={()=>{depth=level;showLevelContent=!showLevelContent;$MenuCurrentChild=self;editing=true}} class=" btn btn-sm {level==0?"ml-auto":""}">✎</Button>
        <Button on:click={()=>{depth=level+1;showLevelContent=!showLevelContent;$MenuCurrentChild=self}} class="btn btn-sm">+</Button>
    </div>
</li>
{#if children?.length && expanded}
{#each children as child}

<svelte:self children={child.children} level={level+1} self={child} parent={self} bind:editing bind:depth bind:showLevelContent/>
{/each}
{/if}

<style>
    .arrow {
  position: absolute;
  left:0;
  top:40%;
  transform: translateY(-50%);
  border: solid black;
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 3px;
  transform: rotate(-45deg);
  margin-right: 10px;
  transition:transform 0.1s ease-in
}
.expanded{
    transform: rotate(45deg);
}
</style>