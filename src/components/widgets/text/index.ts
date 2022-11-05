import type { Display } from "../types"

export default ({title,display}:{title:string,localization?:boolean,display?:Display}) =>{
if(!display) display =(data:any,field: any, entry: any)=>data
let field:any= {schema:{},title,display}
field.schema[title]="string"
field.widget_name = "Text"
return field
}