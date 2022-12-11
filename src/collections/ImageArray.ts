import widgets from '../components/widgets';
import Posts from './Posts';
import type { Schema } from './types';

let schema: Schema = {
	// collection Name and Icon
	name: 'Image Array',
	icon: 'bi:images',

	// collection fields from available widgets
	fields: [
		widgets.ImageArray({
			title: 'ImageArray',
			fields: [
				widgets.ImageUpload({ title: 'Multi Image Array', path: 'media/image_array' }),

				widgets.Text({ title: 'Name', icon: 'ri:t-box-line' }),
				widgets.Text({ title: 'Alt-Text', icon: 'ic:outline-loyalty' }),
				widgets.Text({ title: 'Alt-Title', icon: 'ri:t-box-line' }),

				widgets.Relation({
					title: 'Relation to Posts',
					icon: 'mdi:relation-many-to-one',
					relation: Posts,
					display: async (data: any, field: any, entry: any) => {
						return data.Name;
					}
				})
			]
		})
	]
};

export default schema;
