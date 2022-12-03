import Images from "./Images";
import Posts from "./Posts";
import Media from "./Media";
import Menu from "./Menu";
import multiImage from "./MultiImage";


let categories =  [
  {
  category:"collections",
  collections:[
    Images,
    Posts,
    Media,
    Menu,
    multiImage
  ]
},

   
  ]
export {categories}
export default categories.map(x=>x.collections).reduce((x,acc)=> x.concat(acc))