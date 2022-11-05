
export let DB={}

export  let fieldsToSchema =(fields: Array<any>) => {
    let schema:{widget_name?:"string"} = {}
    for (let field of fields){
        schema={...schema,...field.schema}
    }
    delete schema.widget_name;
    return schema
}

import axios from "axios";
import fs from "fs"
import schemas from '../collections'
import type { Schema } from "../collections/types";
import env from "../../env"
export  function saveFiles(req:any){

    
    let files:any = {};
    let schema = schemas.find(schema => schema.name === req.params.endpoint)
    let _files = req.files  as Array<Express.Multer.File> || []
    console.log(_files)
    for(let file of _files){
        let {buffer,fieldname,...meta} =file
        files[fieldname as keyof typeof files] = meta
        let path = schema?.fields.find(field => field.title === fieldname).path
          if(!fs.existsSync(path)) fs.mkdirSync(path,{ recursive: true })
          
          fs.writeFileSync(path+"/"+meta.originalname,buffer)
        }
        return files
    }



  export  function parse(obj:any){
    for (let key in obj){
        try{
          
            if(Array.isArray(obj[key])){
                    for (let index of obj[key]){
                        obj[key][index]=JSON.parse(obj[key][index])
                    }
            }else{

                obj[key]=JSON.parse(obj[key])
            }
        }catch(e){}
 
    if(typeof obj[key] !="string"){
        parse( obj[key])
    }
}
return obj
}

export function getInputFieldsData(sections:Array<HTMLDivElement>,fields:Array<any>){
    let formFieldsData:any ={}
    for(let index in fields){
        let inputs:any = [...sections[index].children].filter((x:any)=>x.value || x.files)
        inputs = inputs.length > 1?inputs.map((x:any)=>x.files||x.value):inputs[0]?.files || inputs[0]?.value||null
        if(!inputs)continue
        formFieldsData[fields[index].field.title] = inputs
}
return formFieldsData
}

export async  function findById(id:string,collection:Schema){
    return (await axios.get(`${env.HOST}:${env.PORT}/api/findById?collection=${collection.name}&id=${id}`)).data
 }