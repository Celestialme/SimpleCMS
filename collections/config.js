// Configure how Collections are sorted & displayed in Categories section
// TODO Add translations
export function createCategories(collection) {
    return [
        {
            name: 'Collections',
            icon: 'bi:collection',
            collections: [
                collection.Posts,
                collection.Names,
                collection.Posts2,
                collection.Names2,
                collection.Relation,
                collection.Media,
                collection.WidgetTest
            ]
        },
        {
            name: 'Menu',
            icon: 'bi:menu-button-wide',
            collections: [collection.Menu]
        }
    ];
}
