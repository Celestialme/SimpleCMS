<script lang="ts">
    import { Search ,DarkMode} from "flowbite-svelte";


    export let dropDownData:Array<any>=[];
    export let showDropDown:boolean;
    export let selected;
    export let display:any
    let value="";
    let data:Array<any>=[]
    let filteredData=data
    $:{filteredData = data.filter((x:any)=>{return value?x.item.includes(value):true});value;data}
    $:process_data(dropDownData)
    async function process_data(dropDownData:Array<any>){
        let temp = []
        for(let item of dropDownData){
            console.log(item)
            temp.push({item:await display(item),_id:item._id})
        }
        data=temp
        
    }
    function getVal(e:Event){
        value = (e.target as HTMLInputElement).value;
        console.log(value)
    }
</script>
{#if showDropDown}
    <div class="container text-black">
    <Search on:keyup={getVal} size="md" />
    {#each filteredData as item}
    <p on:click={()=>{selected=item;showDropDown=false;}}>{item.item}</p>

    {/each}

    </div>
{/if}
<style>
    .container{
        position: absolute;
        top: 100%;
        left:0;
        background-color:white;
        margin-top: 5px;
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;
    }
    p{
        padding:10px;

    }
    p:hover{
        background-color: #65dfff;
        color:white;

    }
</style>
