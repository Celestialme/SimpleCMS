<script lang="ts">
     import Fields from "@src/components/Fields.svelte";
    import { getInputFieldsData ,findById} from "@src/utils/utils";
    import {  get_fields, saveSimpleData } from "@src/utils/utils_svelte";
    import {prevFormData} from "@root/stores/store"
    export let field:any
    export let value:any;
    let expanded:boolean = false
    let inputFields:HTMLDivElement[] =[]
    let relativeDataId:string=value;
    let getData=async()=>{
       let relationField =  getInputFieldsData(inputFields,get_fields(field.relation))
       let obj:any = {}
     relativeDataId =  (await saveSimpleData(field.relation,relationField,relativeDataId)).data[0]?._id || relativeDataId
     console.log(relativeDataId) 
       obj[field.title]=relativeDataId;
          return obj;
    };
    (async()=>{
      if(value && typeof value=="string"){
        value =  await findById(value,field.relation)
      }
    })()



</script>

{#if !expanded}
<div class="flex bg-white py-1 items-center justify-center gap-1 rounded-lg">
<p on:click|preventDefault={()=>expanded = !expanded} class="ml-auto">{$prevFormData?.displays?.[field.title] || "Chose existing..."} </p>
<div class="ml-auto btn btn-small">✎</div>  
<div class="mr-1 btn btn-small">+</div>  

</div>

{:else} 

<Fields  {getData} bind:inputFields {value} fields={get_fields(field.relation)}/>

{/if}