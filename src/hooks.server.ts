import type { Handle } from '@sveltejs/kit';

import { adminAuth } from '$lib/server/firebase';

export const handle = (async ({ event, resolve }) => {
	const sessionCookie = event.cookies.get('__session');
	if (!sessionCookie) {
		event.locals.userId = null;
		return resolve(event);
	}

	try {
		const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
		event.locals.userId = decodedClaims.uid;
	} catch (err) {
		event.locals.userId = null;
	}
	return resolve(event);
}) satisfies Handle;
