const schema = {
    // Collection Name comming from filename
    // Optional & Icon , status, slug
    // See for possible Icons https://icon-sets.iconify.design/
    icon: 'bi:card-text',
    status: 'published',
    slug: 'posts',
    // Collection Permissions by user Roles
    // Defined Fields that are used in Collection
    // Widget fields can be inspected for individual options
    fields: [
        globalThis.widgets.Email({
            label: 'email',
            icon: 'material-symbols:mail',
            translated: false
            // display: async (data, field, entry, contentLanguage) => {
            // 	return data[contentLanguage];
            // },
        }),
        globalThis.widgets.Text({
            label: 'test',
            db_fieldName: 'dbtest',
            translated: true,
            required: true,
            icon: 'ri:t-box-line',
            placeholder: 'Enter Test Placeholder'
        }),
        globalThis.widgets.ImageUpload({
            label: 'image',
            required: true,
            icon: 'material-symbols:image-outline',
            path: 'images' //This save to image folder, and is not globally available
        })
    ]
};
export default schema;
