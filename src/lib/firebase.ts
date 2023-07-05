import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import {
	collection,
	CollectionReference,
	doc,
	type DocumentData,
	getFirestore,
	onSnapshot
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { derived, type Readable, writable } from 'svelte/store';

import type { FUserDoc } from '~types/firebase';

const firebaseConfig = {
	apiKey: 'AIzaSyBzZNvmeN-ZkZv_ZSZPg08URGu8HnwCBes',
	authDomain: 'svelte-test-505ad.firebaseapp.com',
	projectId: 'svelte-test-505ad',
	storageBucket: 'svelte-test-505ad.appspot.com',
	messagingSenderId: '357400476936',
	appId: '1:357400476936:web:0eada10173fbc62c3ec0bd'
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();

const createCollection = <T = DocumentData>(collectionName: string) => {
	return collection(db, collectionName) as CollectionReference<T>;
};

export const usersCollection = createCollection<FUserDoc>('users');

function userStore() {
	let unsubscribe: () => void;

	if (!auth || !globalThis.window) {
		console.warn('Auth is not initialized or not in browser');
		const { subscribe } = writable<User | null>(null);
		return {
			subscribe
		};
	}

	const { subscribe } = writable(auth?.currentUser ?? null, (set) => {
		unsubscribe = onAuthStateChanged(auth, (user) => {
			set(user);
		});

		return () => unsubscribe();
	});

	return { subscribe };
}

export const user = userStore();

export function docStore<T>(path: string) {
	let unsubscribe: () => void;

	const docRef = doc(db, path);
	

	const { subscribe } = writable<T | null>(null, (set) => {
		unsubscribe = onSnapshot(docRef, (snapshot) => {
			set((snapshot.data() as T) ?? null);
		});

		return () => unsubscribe();
	});

	return { subscribe, ref: docRef, id: docRef.id };
}

export const userData: Readable<FUserDoc | null> = derived(user, ($user, set) => {
	if ($user) {
		return docStore<FUserDoc>(`users/${$user.uid}`).subscribe(set)
	} else {
		set(null);
	}
});
