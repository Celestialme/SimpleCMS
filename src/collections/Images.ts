import Posts from "./Posts";
import type { Schema } from "./types";
import widgets from "../components/widgets"
let schema: Schema = {
  name: "images",
  icon: "bi:card-image",
  fields: [
    widgets.Text({ title: "name2" }),
    widgets.Relation({
      title: "relation_title",
      relation: Posts,
      display: async (data: any, field: any, entry: any) => {
        return data.Name;
      },
    }),
  ],
};
export default schema;
