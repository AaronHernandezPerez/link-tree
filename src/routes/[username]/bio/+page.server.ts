import { error, fail, redirect } from '@sveltejs/kit';
import type { DocumentReference } from 'firebase-admin/firestore';

import { adminAuth, adminDb } from '$lib/server/firebase';

import type { FUserDoc } from '~types/firebase';

import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals, params }) => {
	const uid = locals.userId;

	if (!uid) {
		throw redirect(301, '/login');
	}

	const userDoc = await adminDb.collection('users').doc(uid).get();
	const userData = userDoc.data();

	if (!userData || params.username !== userData.username) {
		throw error(401, `Invalid username`);
	}

	return {
		bio: userData?.bio
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ locals, params, request }) => {
		const uid = locals.userId;
		if (!uid) {
			throw error(401, `Invalid user id`);
		}

		const data = await request.formData();
		const bio = data.get('bio') ?? '';

		if (typeof bio !== 'string') {
			return fail(400, { problem: 'Invalid bio' });
		}

		const userRef = adminDb.collection('users').doc(uid) as DocumentReference<FUserDoc>;
		const { username } = (await userRef.get()).data() ?? {};

		if (params.username !== username) {
			throw error(401, `Invalid username`);
		}

		if (bio.length > 260) {
			return fail(400, { problem: 'Bio must be less than 260 characteres' });
		}

		await userRef.update({ bio });
	}
} satisfies Actions;
