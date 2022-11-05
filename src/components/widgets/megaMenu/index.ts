import type { Display } from "../types"

export default ({title,menu,display}:{title:string,menu:object,display?:Display}) =>{
    if(!display) display =(data:any,field: any, entry: any)=>data.name

    let field:any= {schema:{},title, menu,strict:false,display}
    field.schema[title]={
        
    }
    field.widget_name = "MegaMenu"
    return field
    }