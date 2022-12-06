import type { Display } from "../types";
export default ({ title, display, fields }: { title: string; display?: Display; fields: Array<any> }) => {
  let uploader = fields.find((x) => (x.upload = true));
  if (!display) display = async (data: any, field: any, entry: any) => `<img class='max-w-[200px] inline-block' src="${uploader.path}/${entry[uploader.title].originalname}" />`;

  let field: any = { schema: {}, title, upload: true, fields, display };
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
   return (await import("./ImageArray.svelte")).default;
  };
  return field;
};
