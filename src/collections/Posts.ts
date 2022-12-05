import Text from "../components/widgets/text";
import imageUpload from "../components/widgets/imageUpload";
import type { Schema } from "./types";
let schema: Schema = {
  name: "Posts",
  icon: "bi:card-text",
  fields: [
    Text({ title: "Name", icon: "ri:t-box-line", placeholder: "Enter Name" }),
    Text({ title: "Author", icon: "bi:person", placeholder: "Enter Author" }),
    Text({
      title: "Number as Text",
      icon: "carbon:character-whole-number",
      prefix: "€",
      suffix: "cent",
      count: "10",
      placeholder: "Enter Number",
    }),
  ],
};
export default schema;
