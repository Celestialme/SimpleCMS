import type { Display } from "../types"

export default ({title,path="",display}:{title:string,path:string,display?:Display}) =>{

if(!display)display =async(data:any,field: any, entry: any)=>`<img class='max-w-[200px] inline-block' src="${path}/${data.originalname}" />`


let field:any= {schema:{},title,upload:true,path,display}
field.schema[title]={
    
        
    originalname: "string",
    encoding: "string",
    mimetype: "string",
    size: "number",
    filename: "string",  
    alt:"string",
    
}
field.widget_name = "ImageUpload"
return field
}