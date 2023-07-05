<script lang="ts">
	import { arrayRemove, arrayUnion, doc, setDoc, updateDoc } from 'firebase/firestore';
	import { writable } from 'svelte/store';

	import { page } from '$app/stores';
	import SortableList from '$lib/components/SortableList.svelte';
	import UserLink from '$lib/components/UserLink.svelte';
	import { user, userData, usersCollection } from '$lib/firebase';

	import type { FUserDoc } from '~types/firebase';

	const icons = ['Twitter', 'YouTube', 'TikTok', 'LinkedIn', 'GitHub', 'Custom'];

	const formDefaults = {
		icon: 'custom',
		title: '',
		url: 'https://'
	};

	const formData = writable(formDefaults);

	let showForm = false;

	$: urlIsValid = $formData.url.match(/^(ftp|http|https):\/\/[^ "]+$/);
	$: titleIsValid = $formData.title.length < 20 && $formData.title.length > 0;
	$: formIsValid = urlIsValid && titleIsValid;

	async function addLink() {
		if (!$user) {
			console.error('addLink: No user found');
			return;
		}
		const userRef = doc(usersCollection, $user.uid);

		await updateDoc(userRef, {
			links: arrayUnion({
				...$formData,
				id: Date.now().toString()
			})
		});

		formData.set({
			icon: '',
			title: '',
			url: ''
		});

		showForm = false;
	}

	async function deleteLink(item: any) {
		if (!$user) {
			console.error('deleteLink: No user found');
			return;
		}
		const userRef = doc(usersCollection, $user.uid);
		await updateDoc(userRef, {
			links: arrayRemove(item)
		});
	}

	function cancelLink() {
		formData.set(formDefaults);
		showForm = false;
	}

	function sortList(e: CustomEvent<FUserDoc['links']>) {
		if (!$user) {
			console.error('sortList: No user found');
			return;
		}
		const newList = e.detail;
		const userRef = doc(usersCollection, $user.uid);
		setDoc(userRef, { links: newList }, { merge: true });
	}
</script>

<main class="max-w-xl mx-auto w-11/12 md:w-8/12">
	{#if $userData?.username == $page.params.username}
		<h1 class="mx-2 text-2xl font-bold mt-8 mb-4 text-center">Edit your Profile links</h1>

		<SortableList list={$userData?.links} on:sort={sortList} let:item>
			<div class="relative">
				<button
					class="absolute right-0 top-0 hover:bg-white rounded-full p-1"
					on:click={() => deleteLink(item)}>❌</button
				>
				<UserLink {...item} />
			</div>
		</SortableList>

		{#if showForm}
			<form class="bg-base-200 p-6 w-full mx-auto rounded-xl" on:submit|preventDefault={addLink}>
				<select name="icon" class="select select-sm" bind:value={$formData.icon}>
					{#each icons as icon}
						<option value={icon.toLowerCase()}>{icon}</option>
					{/each}
				</select>
				<input
					name="title"
					class="input input-sm"
					placeholder="Title"
					type="text"
					bind:value={$formData.title}
				/>
				<input
					name="url"
					class="input input-sm"
					placeholder="URL"
					type="text"
					bind:value={$formData.url}
				/>
				<div class="my-4">
					{#if !titleIsValid}
						<p class="text-error text-xs">Must have valid title</p>
					{/if}
					{#if !urlIsValid}
						<p class="text-error text-xs">Must have a valid URL</p>
					{/if}
					{#if formIsValid}
						<p class="text-success text-xs">Looks good!</p>
					{/if}
				</div>

				<button class="btn btn-success block" disabled={!formIsValid} type="submit">Add Link</button
				>

				<button class="btn btn-xs my-4" type="button" on:click={cancelLink}>Cancel</button>
			</form>
		{:else}
			<button
				class="btn btn-outline btn-info block mx-auto my-4"
				on:click={() => (showForm = true)}
			>
				Add a Link
			</button>
		{/if}

		<div class="flex justify-center my-5">
			<a
				class="btn btn-secondary"
				aria-current={$page.url.pathname === '/about'}
				href={`/${$page.params.username}`}>Back to your page</a
			>
		</div>
	{:else}
		<h2>You don't have access to this account!</h2>
	{/if}
</main>
