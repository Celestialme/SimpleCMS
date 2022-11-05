import ImagesUpload from "../components/widgets/imageUpload"
import type { Schema } from "./types"
 let schema:Schema ={
    name: 'Media',
   fields:[
    ImagesUpload({title:"Upload Image",path:"media/images"})
   ]
}
export default schema