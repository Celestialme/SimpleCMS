<script lang="ts">
     import Fields from "@src/components/Fields.svelte";
    import { getInputFieldsData ,findById,find} from "@src/utils/utils";
    import {  get_fields, saveSimpleData } from "@src/utils/utils_svelte";
    import {prevFormData,getFieldsData} from "@src/stores/store"
    import DropDown from "@src/components/DropDown.svelte";
    import { Button } from "flowbite-svelte";
    export let field:any
    export let value:any;
    let expanded:boolean = false
    let inputFields:HTMLDivElement[] =[]
    let relativeDataId=value;
    let showDropDown=false;
    let selectedField:any;
    let selected:any;
    $:selected ?selectedField = selected.item:selectedField=null
    let dropDownData:any=[]
    let getData=async()=>{
      let obj:any = {}
      if(!selected){
       let relationField =  getInputFieldsData(inputFields,get_fields(field.relation))
     relativeDataId =  (await saveSimpleData(field.relation,relationField,relativeDataId,!relativeDataId)).data[0]?._id || relativeDataId
      }else{
        relativeDataId = selected._id
      }
       obj[field.title]=relativeDataId;
          return obj;
    };
    (async()=>{
      if(value && typeof value=="string"){
        value =  await findById(value,field.relation)        
      }
    })()


    $getFieldsData.add(getData)
</script>

{#if !expanded }
<div class="flex bg-white py-1 items-center justify-center gap-1 rounded-lg">
<p  on:click={async ()=>{!dropDownData.length && (dropDownData=await find({},field.relation));showDropDown=!showDropDown}} class="w-full text-center cursor-pointer">{selectedField || (value && $prevFormData?.displays?.[field.title]) || "Chose existing..."} </p>
<Button  on:click={()=>{value=null;relativeDataId=null;selected=null}} class="btn btn-small">D</Button>  
<Button on:click={()=>{expanded = !expanded;selected=null}} class=" mr-1 btn btn-small">{value?"✎":"+"}</Button>
<DropDown bind:showDropDown {dropDownData} bind:selected display={field.rawDisplay}/>
</div>

{:else} 
<div class="p-[20px] my-4 rounded-lg border-2 border-[#8cccff] relative" >
  <Button on:click={()=>{expanded = !expanded;selected=null}} size="xs"  gradient color="red" class="z-10 top-0  absolute right-0">X</Button>
  <Fields  {getData} bind:inputFields value={selected||value} fields={get_fields(field.relation)}/>
</div>

{/if}