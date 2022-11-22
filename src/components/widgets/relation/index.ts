import { findById } from "../../../utils/utils"
import type { Schema } from "../../../collections/types"
import type { Display } from "../types"
export default ({title,relation,display}:{title:string,relation:Schema,display?: Display}) =>{
    let _display:Display|undefined;
    if(!display) display =async (data:any,field: any, entry: any)=>data
    else _display =async (data:any,field: any, entry: any)=>{
       let _data =  await findById(data,relation)
      return await (display as Display)(_data,field,entry)
    }
    if(!_display) _display= display
    let field:any= {schema:{},title, strict:false,relation,display:_display,rawDisplay:display}
    field.schema[title]="string"
    
    field.widget_name = "Relation"
    return field
    }