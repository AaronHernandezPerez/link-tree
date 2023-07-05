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
<main class="max-w-xl mx-auto w-11/12 md:w-8/12">
	<h1 class="text-7xl text-purple-500 mb-8 text-center">@{data.username}</h1>

	<img class="mx-auto" alt="photoURL" src={data.photoURL ?? userImage} width="256" />
	<p class="text-xl my-8">{data.bio ?? 'No bio yet ...'}</p>

	<ul class="list-none w-full">
		{#each data.links as link}
			<div class="my-5 mx-auto">
				<UserLink icon={link.icon} title={link.title} url={link.url} />
			</div>
		{/each}
	</ul>

	{#if $userData?.username === data.username}
		<p class="my-5">Edit your page</p>
		<div class="flex justify-center flex-wrap gap-4 my-4">
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
		<p class="text-sm text-center">
			You like what you see? <a class="hover:text-primary underline" href="/login"
				>create your own!</a
			>
		</p>
	{/if}
</main>
