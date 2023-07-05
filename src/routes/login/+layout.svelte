<script lang="ts">
	import { page } from '$app/stores';
	import AnimatedRoute from '$lib/components/AnimatedRoute.svelte';
</script>

<nav class="flex justify-center my-6">
	<ul class="steps">
		<a class="step step-primary" href="/login">Sign In</a>
		<a
			class="step"
			class:step-primary={$page.route.id?.match(/username|photo/g)}
			href="/login/username"
		>
			Choose Username
		</a>
		<a class="step" class:step-primary={$page.route.id?.includes('photo')} href="/login/photo">
			Upload Photo
		</a>
	</ul>
</nav>

<AnimatedRoute>
	<main class="max-w-xl mx-auto w-11/12 md:w-8/12">
		<div class="card-body items-center text-center">
			<slot />
		</div>
	</main>
</AnimatedRoute>
