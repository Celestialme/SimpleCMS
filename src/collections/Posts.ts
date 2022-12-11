import widgets from "../components/widgets";
import type { Schema } from "./types";
let schema: Schema = {
  name: "Posts",
  icon: "bi:card-text",
  fields: [
    widgets.Text({ title: "Name", icon: "ri:t-box-line", placeholder: "Enter Name" }),
    widgets.Text({ title: "Author", icon: "bi:person", placeholder: "Enter Author" }),
    widgets.Text({
      title: "Number as Text",
      icon: "carbon:character-whole-number",
      prefix: "€",
      suffix: "cent",
      count: "10",
      placeholder: "Enter Number",
      required: true,
			localization: true,
    }),
  ],
};
export default schema;
