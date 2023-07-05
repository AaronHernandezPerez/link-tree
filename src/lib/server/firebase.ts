import FirebaseAdmin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

import {
	FIREBASE_CLIENT_EMAIL,
	FIREBASE_PRIVATE_KEY,
	FIREBASE_PROJECT_ID
} from '$env/static/private';

try {
	FirebaseAdmin.initializeApp({
		credential: FirebaseAdmin.credential.cert({
			projectId: FIREBASE_PROJECT_ID,
			clientEmail: FIREBASE_CLIENT_EMAIL,
			privateKey: FIREBASE_PRIVATE_KEY
		})
	});
} catch (e: unknown) {
	if ((e as { code?: string })?.code !== 'app/duplicate-app')
		console.error('error initializing firebase admin', e);
}

export const adminDb = getFirestore();
export const adminAuth = getAuth();
