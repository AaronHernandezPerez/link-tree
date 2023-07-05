<script lang="ts">
	import { doc, getDoc, writeBatch } from 'firebase/firestore';

	import AuthCheck from '$lib/components/AuthCheck.svelte';
	import { db, user, userData } from '$lib/firebase';

	let username = '';
	let isLoading = false;
	let isAvailable = false;

	const re = /^(?=[a-zA-Z0-9._]{3,16}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

	$: isValid = username?.length > 2 && username.length < 16 && re.test(username);
	$: isTouched = username.length > 0;
	$: isTaken = isValid && !isAvailable && !isLoading;

	let debounceTimer: NodeJS.Timeout;

	async function checkAvailability() {
		clearTimeout(debounceTimer);
		if (!isValid) return;

		isAvailable = false;
		isLoading = true;
		debounceTimer = setTimeout(async () => {
			const ref = doc(db, 'usernames', username);
			const exists = await getDoc(ref).then((doc) => doc.exists());

			isAvailable = !exists;
			isLoading = false;
		}, 500);
	}
	async function confirmUsername() {
		if (!$user?.uid) {
			console.error('No user is logged in');
			return;
		}

		const batch = writeBatch(db);

		batch.set(doc(db, 'usernames', username), { uid: $user.uid });
		batch.set(doc(db, 'users', $user.uid), {
			username,
			photoURL: $user?.photoURL,
			published: true,
			bio: 'Your bio here',
			links: [
				{
					title: 'Test link',
					url: 'https://google.com',
					icon: 'custom',
					id: Date.now().toString()
				}
			]
		});

		await batch.commit();
		username = '';
		isAvailable = false;
	}
</script>

<AuthCheck>
	{#if $userData?.username}
		<p>
			Your username is <span class="text-xl font-bold text-emerald-400">@{$userData.username}</span>
		</p>
		<p class="text-sm">(Usernames cannot be changed)</p>
		<a class="btn btn-primary" href="/login/photo">Upload Profile Image</a>
	{:else}
		<form class="w-2/5" on:submit|preventDefault={confirmUsername}>
			<input
				class="input w-full"
				class:input-error={!isValid && isTouched}
				class:input-success={isAvailable && isValid && !isLoading}
				class:input-warning={isTaken}
				placeholder="Username"
				type="text"
				bind:value={username}
				on:input={checkAvailability}
			/>

			<div class="my-4 min-h-16 px-8 w-full">
				{#if isLoading}
					<p class="text-secondary">Checking availability of @{username}...</p>
				{/if}

				{#if !isValid && isTouched}
					<p class="text-error text-sm">must be 3-16 characters long, alphanumeric only</p>
				{/if}

				{#if isValid && !isAvailable && !isLoading}
					<p class="text-warning text-sm">
						@{username} is not available
					</p>
				{/if}

				{#if !username}
					<p class="text-sm">Enter your username!</p>
				{/if}

				{#if isValid && isAvailable}
					<button class="btn btn-success" disabled={!isValid || !isAvailable || isLoading}
						>Confirm username @{username}
					</button>
				{/if}
			</div>
		</form>{/if}
</AuthCheck>
