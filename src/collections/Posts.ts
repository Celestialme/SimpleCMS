import Text from "../components/widgets/text"
import imageUpload from "../components/widgets/imageUpload"
import type { Schema } from "./types"
 let schema:Schema ={
    name: 'Posts',
   fields:[
    Text({title:"name"}),
    Text({title:"author"}),
  
   ]
}
export default schema