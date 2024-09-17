import { error } from '@sveltejs/kit';

export async function load({ locals }) {
	let user = locals.user;

	if (locals.error) {
		throw error(locals.error.status, locals.error.message);
	}
	return {
		user: user
	};
}
