import MegaMenu from "../components/widgets/megaMenu";
import Text from "../components/widgets/text";
import Relation from "../components/widgets/relation";
import Posts from "./Posts";
import type { Schema } from "./types";
let schema: Schema = {
  name: "Menu",
  icon: "bi:menu-button-wide",
  strict: false,
  fields: [
    MegaMenu({
      title: "Menus",
      menu: [
        {
          fields: [Text({ title: "name" })],
        },
        {
          fields: [
            Text({ title: "name" }),
            Relation({
              title: "bla_name",
              relation: Posts,
              display: async (data: any, field: any, entry: any) => {
                return data.name;
              },
            }),
          ],
        },
        {
          fields: [Text({ title: "name" }), Text({ title: "img" }), Text({ title: "address" })],
        },
        {
          fields: [Text({ title: "name" }), Text({ title: "img" }), Text({ title: "address" })],
        },
      ],
    }),
  ],
};
export default schema;
