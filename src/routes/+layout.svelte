<script>
	import '../app.css';

	// import { redirect } from '@sveltejs/kit';
	// import { browser } from '$app/environment';
	// import { goto } from '$app/navigation';
	import { user, userData } from '$lib/firebase';

	// Preloading firebase store data
	$user;
	$userData;

	// if (browser) {
	// 	if ($userData) {
	// 		goto('/' + $userData.username);
	// 	} else {
	// 		goto('/login');
	// 	}
	// } else {
	// 	if ($userData) {
	// 		redirect(308, '/' + $userData.username);
	// 	} else {
	// 		redirect(308, '/login');
	// 	}
	// }
</script>

<div class="min-h-screen flex flex-col">
	<slot />
</div>
