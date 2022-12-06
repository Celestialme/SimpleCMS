import widgets from "../components/widgets"
import type { Schema } from "./types";
let schema: Schema = {
  name: "Media",
  icon: "bi:menu-button-wide",
  fields: [widgets.ImageUpload({ title: "Upload Image", path: "media/images" })],
};
export default schema;
