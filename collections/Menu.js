let schema = {
    fields: [
        globalThis.widgets.MegaMenu({
            menu: [
                [
                    globalThis.widgets.Text({ label: 'link', translated: true }),
                    globalThis.widgets.Text({ label: 'info', translated: true }),
                    globalThis.widgets.Text({ label: 'info3', translated: true })
                ],
                [
                    globalThis.widgets.Text({ label: 'link', translated: true }),
                    globalThis.widgets.Text({ label: 'info', translated: true }),
                    globalThis.widgets.Text({ label: 'info3', translated: true })
                ]
            ],
            label: 'Menu'
        })
    ]
};
export default schema;
