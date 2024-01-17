let schema = {
    icon: 'pepicons-pop:menu',
    fields: [
        globalThis.widgets.MegaMenu({
            menu: [
                [
                    globalThis.widgets.Text({ label: 'link 1', translated: true }),
                    globalThis.widgets.Text({ label: 'info', translated: true }),
                    globalThis.widgets.Text({ label: 'info3', translated: true })
                ],
                [
                    globalThis.widgets.Text({ label: 'link 2', translated: true }),
                    globalThis.widgets.Text({ label: 'info', translated: true }),
                    globalThis.widgets.Text({ label: 'info3', translated: true })
                ]
            ],
            label: 'Menu'
        })
    ]
};
export default schema;
