import type { RequestHandler } from './$types';
import type widgets from '@src/components/widgets';
import fs from 'fs';
type Widget = typeof widgets;
type fields = ReturnType<Widget[keyof Widget]>;
export const POST: RequestHandler = async ({ request, cookies }) => {
	let formData = await request.formData();
	let fieldsData = formData.get('fields') as string;
	let fields = JSON.parse(fieldsData) as Array<fields>;
	fs.writeFileSync('fields.json', JSON.stringify(fields));
	return new Response(null, { status: 200 });
};
