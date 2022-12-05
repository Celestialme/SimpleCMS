import ImageArray from "../components/widgets/imageArray";
import Text from "../components/widgets/text";
import ImagesUpload from "../components/widgets/imageUpload";
import Relation from "../components/widgets/relation";
import Posts from "./Posts";
import type { Schema } from "./types";

let schema: Schema = {
	// collection Name and Icon
	name: "Image Array",
	icon: "bi:images",

	// collection fields from available widgets
	fields: [
		ImageArray({
			title: "Image",
			fields: [
				ImagesUpload({ title: "Multi Image Array", path: "media/image_array" }),

				Text({ title: "Name", icon: "ri:t-box-line" }),
				Text({ title: "Alt-Text", icon: "ic:outline-loyalty" }),
				Text({ title: "Alt-Title", icon: "ri:t-box-line" }),

				Relation({
					title: "Relation to Posts",
					icon: "mdi:relation-many-to-one",
					relation: Posts,
					display: async (data: any, field: any, entry: any) => {
						return data.name;
					},
				}),
			],
		}),
	],
};

export default schema;
