import Text from "./text/Text.svelte"
import Relation from "./relation/Relation.svelte"
import MegaMenu from "./megaMenu/MegaMenu.svelte"
import ImageUpload from "./imageUpload/ImageUpload.svelte"
import MultiImage from "./multiImage/MultiImage.svelte"
let widgets:Object={}
try{

    widgets =  {
        Text,
        Relation,
        ImageUpload,
        MegaMenu,
        MultiImage
    }
}catch(e){}
export default  widgets