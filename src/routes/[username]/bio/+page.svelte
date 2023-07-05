<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	import type { PageData } from './$types';

	export let data: PageData;
</script>

<main class="max-w-lg prose text-center mx-auto my-6">
	<p>Current Bio: <span class="text-info">{data.bio}</span></p>

	<p>Status Code: {$page.status}</p>
	<p class="text-error">{$page.form?.problem ?? ''}</p>

	<form method="POST" use:enhance>
		<div class="form-control">
			<label class="label" for="bio">
				<span class="label-text">Your bio</span>
			</label>
			<textarea name="bio" class="textarea textarea-bordered textarea-accent" value={data.bio} />
		</div>
		<button class="btn btn-primary my-5">Update Bio</button>
	</form>

	<div class="flex justify-center">
		<a
			class="btn btn-secondary"
			aria-current={$page.url.pathname === '/about'}
			href={`/${$page.params.username}`}>Back to your page</a
		>
	</div>
</main>
