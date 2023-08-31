const schema = {
    // Collection Name comming from filename
    // Optional & Icon , status, slug
    // See for possible Icons https://icon-sets.iconify.design/
    icon: 'bi:images',
    // Collection Permissions by user Roles
    // Defined Fields that are used in Collection
    // Widget fields can be inspected for individual options
    fields: [
        globalThis.widgets.ImageUpload({
            label: 'image',
            path: 'global'
        })
    ]
};
export default schema;
