<script lang="ts">

import { resolve } from "$app/paths"
import Header from './Header.svelte';
</script>


<div class="flex flex-col h-2/3 justify-center items-baseline">
	<div class="bg-gray-900 w-full px-5 py-10 flex flex-col justify-center items-center">
		<p class="prose prose-2xl text-gray-200 text-9xl">Forms</p>
		<p class="prose prose-gray text-gray-400 py-3 px-3">A <span class="line-through">new</span> <span class="font-bold">better</span> way to form</p>
		<a href={resolve('/auth')} class="link
		rounded-md
		p-3
		">Get started</a>
	</div>
</div>

<style>
    @import "tailwindcss";

	.link{
		@apply
		text-gray-50 hover:text-white text-xl
		duration-300
		border-2 border-gray-50/60 hover:border-gray-50
		cursor-pointer
		overflow-hidden
		relative
		z-10
		before:bg-linear-to-r before:from-blue-500 before:via-sky-300 before:to-blue-700
		before:h-full before:w-[200%]
		before:duration-500 before:ease-in-out
		before:absolute before:top-0 hover:before:left-0 before:-left-full
		;
	}

	*::before{
		z-index: -1;
	}
</style>