import { roles } from './types.js';
let schema = {
    icon: 'iconoir:post',
    permissions: {
        [roles.admin]: {
            read: false
        }
    },
    fields: [
        globalThis.widgets.Text({
            label: 'text',
            translated: true
        }),
        globalThis.widgets.Text({
            label: 'text2'
        })
    ]
};
export default schema;
