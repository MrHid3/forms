<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	const routes = [
		{ name: 'Home', path: '/' },
		{ name: 'Auth', path: '/auth' },
	];
</script>

<div class="absolute top-0 left-1/2 -translate-x-1/2
						w-2/3
						flex flex-row justify-evenly
						bg-gray-700
						rounded-b-sm
						">
	{#each routes as route (route.name)}
		{#if page.url.pathname == route.path}
			<a href={resolve(route.path)} class="text-gray-200 text-2xl
																						duration-300
	">{route.name}</a>
		{:else}
			<a href={resolve(route.path)} class="text-gray-400 text-2xl hover:text-gray-200
																						duration-300
		">{route.name}</a>
		{/if}
	{/each}
</div>

<style>
    @import "tailwindcss";
</style>