import Relation from "../components/widgets/relation";
import Text from "../components/widgets/text";
import Posts from "./Posts";
import type { Schema } from "./types";

let schema: Schema = {
  name: "images",
  icon: "bi:card-image",
  fields: [
    Text({ title: "name2" }),
    Relation({
      title: "relation_title",
      relation: Posts,
      display: async (data: any, field: any, entry: any) => {
        return data.name;
      },
    }),
  ],
};
export default schema;
