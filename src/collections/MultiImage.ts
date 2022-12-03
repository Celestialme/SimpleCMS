import MultiImage from "../components/widgets/multiImage"
import Text from "../components/widgets/text"
import ImagesUpload from "../components/widgets/imageUpload"
import type { Schema } from "./types"
 
let schema:Schema = {
    name: 'MultiImages',
   fields:[
    MultiImage({title:"image",fields:[
        ImagesUpload({title:"image2",path:"media/images2"}),
        Text({title:"meta"}),
        Text({title:"size"}),
    ]}),
   ]
}
export default schema