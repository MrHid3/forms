<script lang="ts">

import { resolve } from "$app/paths"
import Header from './Header.svelte';
</script>


<div class="flex flex-col h-2/3 justify-center items-baseline">
	<div class="bg-gray-900 w-full px-5 py-10 flex flex-col justify-center items-center">
		<p class="prose prose-2xl text-gray-200 text-9xl">Forms</p>
		<p class="prose prose-gray text-gray-400 py-3 px-3">A <span class="line-through">new</span> <span class="font-bold">better</span> way to form</p>
		<a href={resolve('/auth')} class="text-gray-50 hover:text-gray-800 text-1xl bg-blue-500 hover:bg-blue-300 duration-300 border-2 border-gray-700 hover:border-blue-300 rounded-md p-3 cursor-pointer">Get started</a>
	</div>
</div>

<style>
    @import "tailwindcss";

</style>