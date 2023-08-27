const widgets = globalThis.widgets;

let schema = {
  name: "images",
  fields: [
    widgets.ImageArray({
      label: "images",
      fields: [
        widgets.ImageUpload({
          label: "image",
          path: "media/images"
        }),
        widgets.Text({
          label: "title",
          db_fieldName: "title",
          translated: false
        })
      ]
    })
  ]
};

export { schema as default };
