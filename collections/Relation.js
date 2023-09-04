import Posts from './Names.js';
const schema = {
    // Collection Name comming from filename
    // Optional & Icon , status, slug
    // See for possible Icons https://icon-sets.iconify.design/
    icon: 'mdi:relation-many-to-many',
    // Collection Permissions by user Roles
    // Defined Fields that are used in Collection
    // Widget fields can be inspected for individual options
    fields: [
        globalThis.widgets.Relation({
            db_fieldName: 'relation',
            label: 'Relation M2M to Posts',
            relation: Posts
        })
    ]
};
export default schema;
