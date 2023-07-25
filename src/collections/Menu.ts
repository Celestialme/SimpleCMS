import widgets from '../components/widgets';
import type { Schema } from './types';
let schema: Schema = {
	name: 'Menu',
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
							label: 'info',
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
							label: 'info2',
							translated: false
						})
					]
				}
			]
		})
	]
};
export default schema;
