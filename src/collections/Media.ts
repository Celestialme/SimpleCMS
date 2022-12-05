import ImagesUpload from "../components/widgets/imageUpload";
import type { Schema } from "./types";
let schema: Schema = {
  name: "Media",
  icon: "bi:menu-button-wide",
  fields: [ImagesUpload({ title: "Upload Image", path: "media/images" })],
};
export default schema;
