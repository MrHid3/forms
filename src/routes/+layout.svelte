<script lang="ts">
    import './layout.css';
    import favicon from '$lib/assets/favicon.svg';
    import {browser} from "$app/environment";
    import {goto} from "$app/navigation";

    let {data, children} = $props();

    let showLogout = $derived(data.loggedIn);
</script>

<svelte:head>
    <link href={favicon} rel="icon"/>
</svelte:head>
{#if showLogout}
    <button onclick={async () => {if(browser) {await fetch("/logout", {method: "POST"}); goto("/auth"); showLogout = false}}}
            class="button absolute top-4 right-4 px-4 py-2 text-xl">Logout
    </button>
{/if}
<div class="
	bg-radial  from-gray-900 to-gray-950
	min-h-screen h-full
"
     style="background-position: 0% -20%;
background-size: 100% 150%"
>

    {@render children()}
</div>

<style>

    :global(body) {
        @apply
        bg-gray-950;
    }

    .button {
        @apply
        text-gray-300 hover:text-gray-200 font-bold text-center
        border-2 border-gray-400 hover:border-gray-300 rounded-lg
        z-50
        overflow-hidden
        cursor-pointer
        duration-150
        before:bg-linear-to-r before:from-gray-900  before:via-slate-500 before:to-gray-900 before:from-20% before:to-80%
        before:h-4/3 before:w-[200%]
        before:absolute before:-left-full
        hover:before:-left-0
        before:-top-3
        before:duration-500 before:ease-out
        ;
    }

    *:before {
        z-index: -1;
    }
</style>

