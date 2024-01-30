let schema = {
    icon: 'iconoir:post',
    permissions: {
        user: {
            read: true
        },
        admin: {
            write: true
        }
    },
    fields: [
        globalThis.widgets.Text({
            label: 'text 1',
            translated: true,
            width: 2
        }),
        globalThis.widgets.Text({
            label: 'text 2',
            translated: true,
            width: 2
        }),
        globalThis.widgets.Text({
            label: 'text 3',
            translated: true,
            width: 2
        }),
        globalThis.widgets.Text({
            label: 'text 4',
            translated: true,
            width: 2
        }),
        globalThis.widgets.Text({
            label: 'text 5',
            translated: true,
            width: 2
        })
    ]
};
export default schema;
