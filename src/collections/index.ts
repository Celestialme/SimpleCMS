import Images from "./Images";
import Posts from "./Posts";
import Media from "./Media";
import Menu from "./Menu";


let categories =  [
  {
  category:"collections",
  collections:[
    Images,
    Posts,
    Media,
    Menu
  ]
},

   
  ]
export {categories}
export default categories.map(x=>x.collections).reduce((x,acc)=> x.concat(acc))