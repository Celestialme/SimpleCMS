const widgets = globalThis.widgets;

let schema = {
  name: "as",
  fields: [
    widgets.Email(
      { "label": "as" }
    )
  ]
};

export { schema as default };
