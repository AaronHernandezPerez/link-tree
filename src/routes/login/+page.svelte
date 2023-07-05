<script lang="ts">
	import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

	import { auth, user } from '$lib/firebase';

	async function signInWithGoogle() {
		const provider = new GoogleAuthProvider();
		const credential = await signInWithPopup(auth, provider);
		const idToken = await credential.user.getIdToken();

		await fetch('/api/signin', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ idToken })
		});
	}

	async function signInOutSSR() {
		await fetch('api/signin', { method: 'DELETE' });
		signOut(auth);
	}
</script>

<h2>Login</h2>
{#if $user}
	<h2 class="card-title">Welcome, {$user.displayName}</h2>
	<p class="text-center text-success">You are logged in</p>
	<a class="btn btn-primary" href="/login/username">Choose your username</a>
	<button class="btn btn-danger" on:click={signInOutSSR}>Sign out</button>
{:else}
	<button class="btn btn-primary" on:click={signInWithGoogle}>Sign in with Google</button>
{/if}
