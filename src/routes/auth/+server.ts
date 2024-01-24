import { redirect } from '@sveltejs/kit';

export const GET = ({ url }) => {
	console.log('redirect auth');
	redirect(302, `/auth/login${url.search}`);
};
