<script>
	export let icon = 'default';
	export let url = 'foo';
	export let title = 'some cool title';
</script>

<a
	class="stack w-full text-center bg-base-300 flex justify-center items-center p-4 rounded-lg not-prose no-underline"
	href={url}
	target="_blank"
>
	<img class="w-8" alt={icon} height="32" src={`/${icon}.png`} width="32" />
	<span class="text-lg text-white font-bold">{title}</span>
</a>
