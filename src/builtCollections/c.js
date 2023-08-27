const widgets = globalThis.widgets;

let schema = {
  name: "c",
  fields: [
    widgets.Text(
      { "translated": false, "db_fieldName": "c", "label": "c" }
    )
  ]
};

export { schema as default };
