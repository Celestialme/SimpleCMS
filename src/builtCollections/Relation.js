const widgets = globalThis.widgets;

let schema$1 = {
  name: "thumbs",
  fields: [widgets.ImageUpload({ label: "Image", path: "images" })]
};

let schema = {
  name: "relation",
  fields: [widgets.Relation({ label: "relation", relation: schema$1 })]
};

export { schema as default };
