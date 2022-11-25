import widgets from "@src/components/widgets";
import {get} from "svelte/store"
import {prevFormData,getFieldsData} from "@src/stores/store"
import axios from "axios";
import  env  from "../../env";
import type { Schema } from "@src/collections/types";
export    function get_fields(collection:{name:string,fields:any}){
    let fields=[]
    for (let field of collection.fields){
        let key:keyof typeof widgets = field.widget_name
        
        fields.push({widget:widgets[key],field})
    }
    return fields
}


export async function saveFormData(collection:Schema){
    let formData =  new FormData()
   
    for(let getData of get(getFieldsData)){
        let data = await getData()
      for (let key in  data){
        if (typeof data[key]=="object"){
            for(let _key in data[key]){ // for multiple files
                console.log(data[key])
                formData.append(key,data[key][_key])
            }
        }else{

            formData.append(key,data[key])
        }
      }
     
    }
    return await saveData(collection,formData)
}


export async function saveSimpleData(collection:Schema,data:any,doc_id?:string,insert?:boolean){
    let formData =  new FormData()
    for (let key in  data){
        if (typeof data[key]=="object"){
            for(let _key in data[key]){ // for multiple files
                console.log(data[key])
                formData.append(key,data[key][_key])
            }
        }else{

            formData.append(key,data[key])
        }
      }
      return await saveData(collection,formData,doc_id,insert)
}



export async function saveData(collection:Schema,formData:FormData,doc_id?:string,insert?:boolean){
    let oldData_id= doc_id || (get(prevFormData) as any)?._id
    if(oldData_id&&!insert){
        formData.append("_id", oldData_id) 
        return  await axios.patch(`${env.HOST}:${env.PORT}/api/${collection.name}`,formData)
    }else{
        return await axios.post(`${env.HOST}:${env.PORT}/api/${collection.name}`,formData)
    }
}
