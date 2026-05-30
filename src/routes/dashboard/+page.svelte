<script lang="ts">
    import {enhance} from '$app/forms';
    import {untrack} from "svelte";
    import { resolve } from '$app/paths';

    interface Form {
        id: number
        title: string,
        slug: string,
        description: string,
        UserId: number,
        isPublished: boolean
        requireLogin: boolean
        shuffleQuestions: boolean
        createdAt: string,
        updatedAt: string
    }

    const {data} = $props();
    let showCreate = $state(false);

    let forms = $derived((data.forms as Form[]).sort((a, b) => Date.parse(a.updatedAt) - Date.parse(b.updatedAt)));

</script>
;
<div class="
w-3/5 h-full
bg-linear-to-b from-gray-900 to-gray-800 from-20% to-100%
mx-auto
px-4
flex flex-col justify-center
">
    <p class="
	text-gray-200 text-center font-bold text-6xl py-5
	">Your forms</p>
    <label class="button text-3xl self-center p-2!" for="createNew">
        Create new
        <input class="hidden peer" id="createNew" type="checkbox" bind:checked={showCreate}>
        <form class="
        absolute -top-full peer-checked:top-1/4 left-1/2 -translate-x-1/2
        w-100 h-100
        border-2 border-gray-200 p-4
        flex flex-col gap-4 justify-baseline
        bg-gray-900
        z-50
        duration-300" method="post" use:enhance action="?/createForm">
            <input class="input" name="title" placeholder="name" required type="text"/>
            <input class="input" name="slug" placeholder="slug" required type="text"/>
            <textarea class="input text-sm" cols="30" name="description" placeholder="description" rows="2"></textarea>
            <label class="input text-sm flex flex-row justify-baseline gap-2 items-center" for="requireLogin">
                <input id="requireLogin" name="requireLogin" type="checkbox">
                Require login
            </label>
            <label class="input text-sm flex flex-row justify-baseline gap-2 items-center" for="shuffleQuestions">
                <input id="shuffleQuestions" name="shuffleQuestions" type="checkbox">
                Shuffle questions
            </label>
            <span class="text-xs text-gray-500">These can all be changed later</span>
            <button class="button" type="submit" onclick={showCreate = false}>Create</button>
        </form>
        <div class="absolute inset-0 bg-black/40 z-30 hidden peer-checked:block   opacity-0 peer-checked:opacity-100 duration-300 delay-75"></div>
    </label>
    <div class="
    grid grid-cols-4 gap-4 p-10
	">
        {#each forms as form (form.id)}
            <a href={resolve(`/form/${form.id}`)} class="
					h-full min-h-20 w-full
					border-2 border-gray-400 hover:border-gray-200
					rounded-xl
					text-gray-400
					px-5 py-2
					relative
					overflow-hidden
					z-10
					duration-150
					before:w-full before:h-[150%]
					before:bg-linear-to-t before:from-gray-900 before:via-gray-700 before:to-gray-900
					before:absolute before:left-0 before:bottom-0 hover:before:-bottom-1/2
					before:duration-300
					">
                <p class="text-gray-200 font-bold">{form.title}</p>
                <p>{form.description}</p>
            </a>
        {/each}
    </div>
</div>

<style>
    @import "tailwindcss";

    .form-property {
        @apply
        font-bold
        text-gray-200;
    }

    *::before {
        z-index: -1;
    }

    .button {
        @apply
        text-gray-200 font-bold text-center hover:text-gray-900
        border-2 border-gray-200 hover:border-transparent
        rounded-sm
        cursor-pointer
        duration-300
        hover:bg-gray-50
        ;
    }

    .input {
        @apply
        text-gray-300
        w-full
        ;
    }
</style>