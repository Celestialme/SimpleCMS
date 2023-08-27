const widgets = globalThis.widgets;

let schema = {
  name: "thumbs",
  fields: [widgets.ImageUpload({ label: "Image", path: "images" })]
};

export { schema as default };
