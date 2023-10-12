export function createCategories(collections) {
    return [
        { name: 'Collections', icon: 'bi:collection', collections: [collections.Posts2, collections.Posts3, collections.thumbs] },
        { name: 'posts', icon: 'bi:images', collections: [collections.imageArray, collections.Menu, collections.Relation] }
    ];
}
