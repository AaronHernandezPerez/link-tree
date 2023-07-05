<script lang="ts">
	import { page } from '$app/stores';
	import userImage from '$lib/assets/user.webp';
	import UserLink from '$lib/components/UserLink.svelte';
	import { userData } from '$lib/firebase';

	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>@{data.username} Links</title>
	<meta name="description" content={data.bio} />
</svelte:head>

<main class="prose text-center mx-auto mt-8">
	<h1 class="text-7xl text-purple-500 mb-8">@{data.username}</h1>

	<img class="mx-auto" alt="photoURL" src={data.photoURL ?? userImage} width="256" />
	<p class="text-xl my-8">{data.bio ?? 'No bio yet ...'}</p>

	<ul class="list-none">
		{#each data.links as link}
			<div class="my-5">
				<UserLink icon={link.icon} title={link.title} url={link.url} />
			</div>
		{/each}
	</ul>

	{#if $userData?.username === data.username}
		<p class="my-5">Edit your page</p>
		<div class="flex gap-4">
			<a
				class="btn btn-primary"
				aria-current={$page.url.pathname === '/about'}
				href={`/${data.username}/edit`}>Edit your links</a
			>
			<a
				class="btn btn-secondary"
				aria-current={$page.url.pathname === '/about'}
				href={`/${data.username}/bio`}>Edit your bio</a
			>
			<a class="btn btn-accent" aria-current={$page.url.pathname === '/about'} href={`/login/photo`}
				>Edit your photo</a
			>
		</div>
	{:else}
		<p class="text-sm">
			You like what you see? <a class="hover:text-primary" href="/login">create your own!</a>
		</p>
	{/if}
</main>
