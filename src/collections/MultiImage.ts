import MultiImage from "../components/widgets/multiImage"
import Text from "../components/widgets/text"
import ImagesUpload from "../components/widgets/imageUpload"
import Relation from "../components/widgets/relation"
import Posts from "./Posts"
import type { Schema } from "./types"
 
let schema:Schema = {
    name: 'MultiImages',
   fields:[
    MultiImage({title:"image",fields:[
        ImagesUpload({title:"image2",path:"media/images2"}),
        Text({title:"meta"}),
        Text({title:"size"}),
        Relation({title:"relation_title",relation:Posts,display:async (data:any,field: any, entry: any)=>{
            return data.name
           }}),
    ]}),
   ]
}
export default schema