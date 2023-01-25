import type { Display } from "../types";
import type { ImageUpload_Field, ImageUpload_Params } from "./types";
let widget =  ({ db_fieldName, path = "", display }: ImageUpload_Params) => {
  if (!display) display = async (data: any, field: any, entry: any) => {console.log(data);return `<img class='max-w-[200px] inline-block' src="${path}/${data.name}" />`};

  let field = { schema: {}, db_fieldName, upload: true, path, display } as ImageUpload_Field;
  field.schema[db_fieldName] = {
		
		size:Number,
		name:String,
		type:String,
		lastModified:Number
	};
  field.widget = async () => {
    // @ts-ignore
    return (await import("./ImageUpload.svelte")).default;
  };
  return field;
};

export default widget