<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
<div class="
	bg-radial  from-gray-900 to-gray-950
<!--	bg-gray-950-->
	min-h-screen h-full
"
     style="background-position: 0% -20%;
background-size: 100% 150%"
>
	{@render children()}
</div>

<style>
    @import "tailwindcss";

	:global(body){
		@apply
		bg-gray-950;
	}
</style>
