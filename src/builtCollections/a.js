const widgets = globalThis.widgets;

let schema = {
  name: "a",
  fields: [
    widgets.Text(
      { "translated": false, "db_fieldName": "a", "label": "a" }
    )
  ]
};

export { schema as default };
