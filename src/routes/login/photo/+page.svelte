<script lang="ts">
	import { doc, updateDoc } from 'firebase/firestore';
	import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

	import userImage from '$lib/assets/user.webp';
	import AuthCheck from '$lib/components/AuthCheck.svelte';
	import { db, storage, user, userData } from '$lib/firebase';

	let previewURL: string;
	let uploading = false;

	async function upload(e: Event) {
		if (!$user) return;

		uploading = true;
		const target = e.target as unknown as { files?: File[] };
		const file = target.files?.[0];
		if (!file) return;
		previewURL = URL.createObjectURL(file);

		const storageRef = ref(storage, `users/${$user.uid}/profile.png`);
		const result = await uploadBytes(storageRef, file);
		const url = await getDownloadURL(result.ref);

		await updateDoc(doc(db, 'users', $user.uid), { photoURL: url });
		uploading = false;
	}
</script>

<AuthCheck>
	<h2 class="card-title">Upload a Profile Photo</h2>

	<form class="max-w-screen-md w-full">
		<div class="form-control w-full max-w-xs my-10 mx-auto text-center">
			<img
				class="mx-auto"
				alt="photoURL"
				height="256"
				referrerpolicy="no-referrer"
				src={previewURL || $userData?.photoURL || ($userData && userImage)}
				width="256"
			/>
			<label class="label mt-5" for="photoURL">
				<span class="label-text">Pick a file</span>
			</label>
			<input
				class="file-input file-input-bordered w-full max-w-xs mb-5"
				accept="image/png, image/jpeg, image/gif, image/webp"
				type="file"
				on:change={upload}
			/>

			{#if uploading}
				<p>Uploading ...</p>
				<progress class="progress progress-info w-56 mt-6" />
			{:else if $userData?.photoURL && $userData}
				<p>Image uploaded!</p>
				<a class="btn btn-primary my-5" href={`/${$userData.username}`}> Visit your profile! </a>
			{/if}
		</div>
	</form>
</AuthCheck>
