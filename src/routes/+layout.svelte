<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from './Header.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="
	bg-radial  from-cyan-950 to-gray-950
<!--	bg-gray-950-->
	h-screen
"
style="background-position: 0% -20%;
background-size: 100% 150%"
>
	{@render children()}
</div>

<style>
    @import "tailwindcss";

</style>
