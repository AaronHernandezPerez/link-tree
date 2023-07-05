import { error } from '@sveltejs/kit';
import { collection, CollectionReference, getDocs, limit, query, where } from 'firebase/firestore';

import { db } from '$lib/firebase';

import type { FUserDoc } from '~types/firebase';

import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
	const collectionRef = collection(db, 'users') as CollectionReference<FUserDoc>;
	const q = query(collectionRef, where('username', '==', params.username), limit(1));
	const snapshot = await getDocs(q);
	const exists = snapshot.docs[0]?.exists();
	if (!exists) throw error(404, "User doesn't exist");

	const data = snapshot.docs[0].data();

	if (!data.published) throw error(403, 'User is not public');

	return {
		username: data.username,
		photoURL: data.photoURL,
		bio: data.bio,
		links: data.links ?? []
	};
}) satisfies PageLoad;
