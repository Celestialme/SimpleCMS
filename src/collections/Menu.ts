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

	// Important All MENU Labels need to be called 'Header' for Menu associate children
	fields: [
		widgets.MegaMenu({
			label: 'Menu',
			menu: [
				{
					fields: [
						widgets.Text({
							label: 'Header',
							placeholder: 'Enter Menu Name',
							required: true,
							translated: true
						})
					]
				},
				{
					fields: [
						widgets.Text({
							label: 'Header',
							placeholder: 'Enter Category Level 1 Name',
							required: true,
							translated: true
						}),
						widgets.Text({
							label: 'Description',
							placeholder: 'Enter Description Level 1',
							required: true,
							translated: true
						}),
						widgets.ImageUpload({
							label: 'image',
							required: true,
							icon: 'material-symbols:image-outline',
							path: 'global'
						}),
						widgets.Text({
							label: 'Title',
							placeholder: 'Image Title',
							required: true,
							translated: true
						}),
						widgets.Text({
							label: 'Alt Text',
							placeholder: 'Image Alt Text',
							required: true,
							translated: true
						}),

						widgets.Seo({
							label: 'Seo',
							translated: true
						})
					]
				},
				{
					fields: [
						widgets.Text({
							label: 'Header',
							placeholder: 'Enter Category Level 2 Name',
							required: true,
							translated: true
						}),
						widgets.Text({
							label: 'Description',
							placeholder: 'Enter Description Level 2',
							required: true,
							translated: true
						}),

						widgets.ImageUpload({
							label: 'Image'
						}),

						widgets.Text({
							label: 'Title',
							placeholder: 'Image Title',
							required: true,
							translated: true
						}),
						widgets.Text({
							label: 'Alt Text',
							placeholder: 'Image Alt Text',
							required: true,
							translated: true
						}),

						widgets.Seo({
							label: 'Seo',
							translated: true
						})
					]
				}
			]
		})
	]
};
export default schema;
