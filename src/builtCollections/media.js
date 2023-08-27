const widgets = globalThis.widgets;

let schema = {
  name: "image upload",
  fields: [
    widgets.ImageUpload({
      label: "image",
      path: "global"
    })
  ]
};

export { schema as default };
