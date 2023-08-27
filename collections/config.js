export function createCategories(imports) {
    return [
        {
            name: 'Collections',
            icon: 'bi:collection',
            collections: [imports.Posts2, imports.Posts3, imports.thumbs]
        },
        {
            name: 'posts',
            icon: 'bi:images',
            collections: [imports.Posts1, imports.ImageArray, imports.Menu, imports.Relation, imports.Media]
        }
    ];
}
