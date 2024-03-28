export function createCategories(collections) {
    return [
        { name: 'Collections', icon: 'bi:collection', collections: [collections.Posts2, collections.Posts3, collections.thumbs, collections.media] },
        { name: 'posts', icon: 'bi:images', collections: [collections.Relation] },
        { name: 'Menus', icon: 'bi:images', collections: [collections.Menu, collections.Menu1, collections.Menu2] }
    ];
}
