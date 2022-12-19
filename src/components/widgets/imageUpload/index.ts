import type { Display } from "../types";
import type { ImageUpload_Field, ImageUpload_Params } from "./types";
let widget =  ({ title, path = "", display }: ImageUpload_Params) => {
  if (!display) display = async (data: any, field: any, entry: any) => `<img class='max-w-[200px] inline-block' src="${path}/${data.originalname}" />`;

  let field = { schema: {}, title, upload: true, path, display } as ImageUpload_Field;
  field.schema[title] = {
    originalname: "string",
    encoding: "string",
    mimetype: "string",
    size: "number",
    filename: "string",
    alt: "string",
  };
  field.widget = async () => {
    // @ts-ignore
    return (await import("./ImageUpload.svelte")).default;
  };
  return field;
};

export default widget