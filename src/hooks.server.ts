import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

const UNPROTECTED_ROUTES = [
	'/auth',
	'/answer/'
];

const UNPROTECTED_EXACTLY = [
	'/'
]

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('token');

	let activeToken: string | null = null;

	if (token) {
		const user = parseJwt(token);
		if (user && user.exp * 1000 > Date.now()) {
			activeToken = token;
		}
	}

	const isUnprotected = UNPROTECTED_ROUTES.some((r) => event.url.pathname.startsWith(r)) || UNPROTECTED_EXACTLY.some((r) => event.url.pathname == r);
	if (!isUnprotected && !activeToken) {
		redirect(302, '/auth');
	}

	return resolve(event);
};

function parseJwt(token: string) {
	try {
		const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
		return JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'));
	} catch {
		return null;
	}
}

