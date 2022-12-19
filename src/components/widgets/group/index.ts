import type { Display } from "../types";
import type { Group_Field, Group_Params } from "./type";
let widget = ({
	title,
	fields,
	required,
	display,
}: Group_Params) => {
	let uploader = fields.find((x) => (x.upload = true));
	if (!display)
		display = async (data: any, field: any, entry: any) =>
			`<img class='max-w-[200px] inline-block' src="${uploader.path}/${
				entry[uploader.title].originalname
			}" />`;

	let field  = { schema: {}, title, upload: true, fields, required, display } as Group_Field;

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
		return (await import("./Group.svelte")).default;
	};
	return field;
};

export default widget