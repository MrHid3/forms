<script lang="ts">
    import {enhance} from '$app/forms';
    import {untrack} from "svelte";
    import {resolve} from '$app/paths';

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

    const {data, form} = $props();
    let showCreate = $state(false);
    let error = $state("");

    let forms = $derived((data.forms as Form[]).sort((a, b) => Date.parse(a.updatedAt) - Date.parse(b.updatedAt)));
</script>
<div class="
w-3/5 h-full
bg-linear-to-b from-gray-900 to-gray-800 from-20% to-100%
mx-auto
px-4
flex flex-col justify-center
rounded-b-xl
">
    <p class="
	text-gray-200 text-center font-bold text-6xl py-5
	">Your forms</p>
    <label class="button text-2xl self-center p-2 z-20!" for="createNew">
        Create new
        <input autocomplete="off" bind:checked={showCreate} class="hidden peer" id="createNew" type="checkbox"/>
    </label>
    <form action="?/createForm" class={`absolute -top-full ${showCreate ? "top-1/4" : ""} left-1/2 -translate-x-1/2
        w-100 h-fit
        border-2 border-gray-200 p-4
        flex flex-col gap-4 justify-baseline
        bg-gray-900
        z-50
        duration-300`} method="post" use:enhance={() => {
            return async ({result, update}) => {
                if(result.data.success){
                    showCreate = false
                    error = "";
                }else{
                    console.log(result)
                    error = result.data.error.message
                }
                await update()
            }
        }}>
        <input class="input" name="title" placeholder="name" required type="text"/>
        <input class="input" name="slug" placeholder="slug" required type="text"/>
        <textarea class="input text-sm" cols="30" name="description" placeholder="description" rows="2"></textarea>
        <label class=" text-sm flex flex-row justify-baseline gap-2 items-center text-gray-300" for="requireLogin">
            <span class="switch">
                <input class="hidden" id="requireLogin" name="requireLogin" type="checkbox">
            </span>
            Require login
        </label>
        <label class="text-sm flex flex-row justify-baseline gap-2 items-center text-gray-300" for="shuffleQuestions">
            <span class="switch">
                <input class="hidden" id="shuffleQuestions" name="shuffleQuestions" type="checkbox">
            </span>
            Shuffle questions
        </label>
        <span class="text-xs text-gray-500">These can all be changed later</span>
        {#if error != "" }
            <span class="error">{error}</span>
        {/if}
        <button class="button p-1 rounded-b-none!" type="submit">Create</button>
        <button class="button p-1 rounded-t-none!" onclick={() => showCreate = false} type="button">Cancel</button>
    </form>
    <div class={`absolute inset-0 bg-black/40 z-30 hidden ${showCreate ? "block! opacity-100!" : ""} opacity-0 duration-300 delay-75`}></div>
    <div class="
    grid grid-cols-4 gap-4 p-10
	">
        {#each forms as form (form.id)}
            <a href={resolve(`/form/${form.id}`)} class="
					h-full min-h-20 w-full
					max-h-40
					px-5 py-2
					relative
					overflow-hidden
					z-10
					duration-150
                    text-gray-300 hover:text-gray-200 font-bold text-center
                    border-2 border-gray-400 hover:border-gray-300 rounded-xl
                    before:bg-conic before:from-gray-900  before:via-slate-600 before:to-gray-900
                    before:h-[800%] before:w-[200%]
                    before:origin-center
                    before:absolute before:-left-full
                    hover:before:-left-0
                    before:-bottom-[450%]
                    before:duration-700 before:ease-out
                    hover:before:rotate-[160deg]
                    text-shadow-md text-shadow-black/40
					">
                <p class="text-gray-200 font-bold">{form.title}</p>
                <p class="text-gray-400">{form.description}</p>
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
        text-neutral-300 hover:text-gray-200 font-bold text-center
        border-2 border-gray-400 hover:border-gray-300 rounded-lg
        z-50
        relative
        overflow-hidden
        cursor-pointer
        before:bg-linear-to-r before:from-gray-900  before:via-slate-500 before:to-gray-900 before:from-20% before:to-80%
        before:h-[200%] before:w-[200%]
        before:absolute before:-left-full
        hover:before:-left-0
        before:-top-3
        before:duration-500 before:ease-out
        text-shadow-md text-shadow-black/40
        ;
    }

    .input {
        @apply
        w-full
        bg-linear-to-t from-slate-700 to-slate-600
        border-0
        rounded-sm
        text-gray-200
        focus:ring-2
        ring-slate-400
        ;
    }

    .switch {
        @apply
        w-12 h-6
        relative
        rounded-xl
        focus:ring-2
        ring-slate-400
        outline-0
        border-2 border-black/20
        overflow-hidden
        cursor-pointer
        before:bg-linear-to-r before:from-gray-900 before:via-slate-500 before:to-gray-900 via-30%
        before:absolute before:-left-4/5 before:top-0 before:h-full before:w-[200%]
        has-checked:before:-left-1/5
        before:duration-150
        before:ease-in-out
        after:rounded-full after:h-full after:w-1/2 after:absolute after:left-0 after:bg-white/40 has-checked:after:left-1/2 after:duration-200 has-checked:after:bg-white/70
        ;
    }

    .error {
        @apply
        text-red-500 bg-red-200 border-2 border-red-600/40
        rounded-md
        p-1 text-sm
        block w-full
        ;
    }
</style>