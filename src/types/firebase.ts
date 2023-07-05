import type { DocumentData } from 'firebase-admin/firestore';

export interface FUserDoc extends DocumentData {
	username: string;
	published: boolean;
	bio: string;
	photoURL: string;
	links: Array<{
		id: string;
		title: string;
		url: string;
		icon: string;
	}>;
}
