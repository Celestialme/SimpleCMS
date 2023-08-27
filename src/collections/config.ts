// Configure how Collections are sorted & displayed in Categories section
// TODO Add translations
export function createCategories(imports: any) {
	return [
		{
			name: 'Collections',
			icon: 'bi:collection',
			collections: [
				imports.Posts,
				imports.Names,
				imports.Posts2,
				imports.Names2,
				imports.Relation,
				imports.Media,
				imports.WidgetTest
			]
		},
		{
			name: 'Menu',
			icon: 'bi:menu-button-wide',
			collections: [imports.Menu]
		}
	];
}
