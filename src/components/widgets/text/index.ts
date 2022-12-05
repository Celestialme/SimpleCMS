import type { Display } from "../types";

export default ({ title, icon, placeholder, count, prefix, suffix, display }: { title: string; icon?: string; placeholder?: string; count?: string; prefix?: string; suffix?: string; localization?: boolean; display?: Display }) => {
  if (!display) display = (data: any, field: any, entry: any) => data;
  let field: any = { schema: {}, title, icon, placeholder, count, prefix, suffix, display };
  field.schema[title] = "string";
  field.widget_name = "Text";
  return field;
};
