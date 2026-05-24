<script lang="ts">
    import {enhance} from '$app/forms';

    const {data} = $props();

    let forms = $derived(data.forms.sort((a, b) => a.updatedAt - b.updatedAt));

    console.log(data.forms)

    let rows = [[], [], [], []];
    let i = 0;
    for (const form of forms) {
        rows[i % 4].push(form);
        i++;
    }
</script>

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
    <label for="createNew" class="button text-3xl self-center p-2!">
        Create new
        <input type="checkbox" class="hidden peer" id="createNew">
        <form use:enhance method="post" class="
        absolute -top-full peer-checked:top-1/4 left-1/2 -translate-x-1/2
        w-100 h-100
        border-2 border-gray-200 p-4
        flex flex-col gap-4 justify-baseline
        bg-gray-900
        z-50
        duration-300">
            <input type="text" class="input" placeholder="name" name="name" required />
            <input type="text" class="input" placeholder="slug" name="slug" required />
            <textarea name="description" cols="30" rows="10" class="input text-sm" placeholder="description" ></textarea>
            <label for="requireLogin" class="input text-sm flex flex-row justify-baseline gap-2 items-center">
                <input type="checkbox" id="requireLogin" name="requireLogin">
                Require login
            </label>
            <label for="shuffleQuestions" class="input text-sm flex flex-row justify-baseline gap-2 items-center">
                <input type="checkbox" id="shuffleQuestions" name="shuffleQuestions">
                Shuffle questions
            </label>
            <span class="text-xs text-gray-500">These can all be changed later</span>
            <button type="submit" class="button">Create</button>
        </form>
       <div class="absolute inset-0 bg-black/40 z-30 opacity-0 peer-checked:opacity-100 duration-300 delay-75"></div>
    </label>
    <div class="
    grid grid-cols-4 gap-4 p-10
	">
        {#each rows as row, index(index)}
            <div class="flex flex-col flex-1 gap-4">

                {#each row as form (form.id)}
                    <a href={`/form/${form.id}`} class="
					h-fit min-h-20 w-full
					border-2 border-gray-400 hover:border-gray-200
					rounded-xl
					text-gray-400
					px-5 py-2
					relative
					overflow-hidden
					z-50
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

    *::before{
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