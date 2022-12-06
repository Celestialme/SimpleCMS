import widgets from "../components/widgets"
import Posts from "./Posts";
import type { Schema } from "./types";
let schema: Schema = {
  name: "Menu",
  icon: "bi:menu-button-wide",
  strict: false,
  fields: [
    widgets.MegaMenu({
      title: "Menus",
      menu: [
        {
          fields: [widgets.Text({ title: "name" })],
        },
        {
          fields: [
            widgets.Text({ title: "name" }),
            widgets.Relation({
              title: "bla_name",
              relation: Posts,
              display: async (data: any, field: any, entry: any) => {
                return data.Name;
              },
            }),
          ],
        },
        {
          fields: [widgets.Text({ title: "name" }), widgets.Text({ title: "img" }), widgets.Text({ title: "address" })],
        },
        {
          fields: [widgets.Text({ title: "name" }), widgets.Text({ title: "img" }), widgets.Text({ title: "address" })],
        },
      ],
    }),
  ],
};
export default schema;
