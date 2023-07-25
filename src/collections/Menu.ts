import widgets from '@src/components/widgets';
import { roles } from './Auth';
import type { Schema } from './types';

let schema: Schema = {
	// Collection Name required
	name: 'Menu',

	// Optional & Icon , status, slug
	// See for possible Icons https://icon-sets.iconify.design/
	icon: 'bi:menu-button-wide',
	strict: false,
	status: 'published',
	slug: 'menu',

	// Defined Fields that are used in Collection
	// Inspect Widget fields for possible options
	fields: [
		widgets.MegaMenu({
			label: 'Menu',
			menu: [
				{
					fields: [
						widgets.Text({
							label: 'Header',
							translated: false
						})
					]
				},
				{
					fields: [
						widgets.Text({
							label: 'Header',
							translated: false
						}),
						widgets.Text({
							label: 'Data',
							translated: false
						})
					]
				},
				{
					fields: [
						widgets.Text({
							label: 'Header',
							translated: false
						}),
						widgets.Text({
							label: 'Data',
							translated: false
						})
					]
				}
			]
		})
	]
};
export default schema;
