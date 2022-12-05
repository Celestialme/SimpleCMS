import Text from "./text/Text.svelte"
import Relation from "./relation/Relation.svelte"
import MegaMenu from "./megaMenu/MegaMenu.svelte"
import ImageUpload from "./imageUpload/ImageUpload.svelte"
import ImageArray from "./imageArray/ImageArray.svelte"
let widgets:Object={}
try{

    widgets =  {
        Text,
        Relation,
        ImageUpload,
        MegaMenu,
        ImageArray
    }
}catch(e){}
export default  widgets