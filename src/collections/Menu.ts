import MegaMenu from "../components/widgets/megaMenu"
import Text from "../components/widgets/text"
import type {Schema} from "./types"
let schema:Schema =  {
    name: 'Menu',
    strict:false,
   fields:[
    Text({title:'seperate'}),
    MegaMenu({title:"Menus",menu:[
      {
          
            fields:[
                Text({title:"name"})
            ],
         
     },
     {
   
        fields:[
            Text({title:"name"}),
            Text({title:"telnum"})
        ],
    },
    {
       
        fields:[
            Text({title:"name"}),
            Text({title:"img"}),
            Text({title:"address"}),
        ],
    },
    {
       
        fields:[
            Text({title:"name"}),
            Text({title:"img"}),
            Text({title:"address"}),
        ],
    }
    ]
    }),
   
   ]
}
export default schema