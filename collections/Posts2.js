import { roles } from './types.js';
const schema = {
    // Collection Name comming from filename
    // Collection Permissions by user Roles
    permissions: {
        [roles.user]: {
            read: false
        },
        [roles.admin]: {
            write: false
        }
    },
    // Optional & Icon , status, slug
    // See for possible Icons https://icon-sets.iconify.design/
    icon: 'bi:card-text',
    // Defined Fields that are used in Collection
    // Widget fields can be inspected for individual options
    fields: [
        globalThis.widgets.Text({
            label: 'Text'
        }),
        globalThis.widgets.Text({
            label: 'Text2'
        }),
        globalThis.widgets.Text({
            label: 'Text3',
            translated: false
        })
    ]
};
export default schema;
