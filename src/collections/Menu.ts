import widgets from '@src/components/widgets';
import { roles } from './Auth';
import type { Schema } from './types';

const schema: Schema = {
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
							label: 'MenuName',
							placeholder: 'Enter Menu Name',
							required: true,
							translated: true
						})
					]
				},
				{
					fields: [
						widgets.Text({
							label: 'Category Name 1',
							placeholder: 'Enter Category Level 1 Name',
							translated: true
						}),
						widgets.Text({
							label: 'Category Data 1',
							placeholder: 'Enter Category Level 1 Data',
							translated: true
						})
					]
				},
				{
					fields: [
						widgets.Text({
							label: 'Category Name 2',
							placeholder: 'Enter Category Level 2 Name',
							translated: true
						}),
						widgets.Text({
							label: 'Category Data2',
							placeholder: 'Enter Category Level 2 Data',
							translated: true
						})
					]
				}
			]
		})
	]
};
export default schema;
