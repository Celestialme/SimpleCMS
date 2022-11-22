<script lang="ts">
     import Fields from "@src/components/Fields.svelte";
    import { getInputFieldsData ,findById,find} from "@src/utils/utils";
    import {  get_fields, saveSimpleData } from "@src/utils/utils_svelte";
    import {prevFormData,getFieldsData} from "@root/stores/store"
    import DropDown from "@src/components/DropDown.svelte";
    export let field:any
    export let value:any;
    let expanded:boolean = false
    let inputFields:HTMLDivElement[] =[]
    let relativeDataId=value;
    let showDropDown=false;
    let selectedField:any;
    let selected:any;
    $:selected ?field.rawDisplay(selected).then((data:any)=> selectedField = data):selectedField=null
    let dropDownData:any
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
<p  on:click={async ()=>{dropDownData=await find({},field.relation);showDropDown=true}} class="ml-auto">{selectedField || (value && $prevFormData?.displays?.[field.title]) || "Chose existing..."} </p>
<div  on:click={()=>{value=null;relativeDataId=null;selected=null}} class="ml-auto btn btn-small">D</div>  
<div on:click|preventDefault={()=>{expanded = !expanded;selected=null}} class=" mr-1 btn btn-small">{value?"✎":"+"}</div>
<DropDown data={dropDownData} bind:selected display={field.rawDisplay}/>
</div>

{:else} 
<Fields  {getData} bind:inputFields value={selected||value} fields={get_fields(field.relation)}/>

{/if}