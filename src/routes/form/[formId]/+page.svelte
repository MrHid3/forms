<script lang="ts">
    import Form from './Form.svelte';
    import Result from './Result.svelte';
    import {resolve} from "$app/paths";

    const {data, form} = $props();
</script>


<div class="
    flex flex-col justify-center items-center gap-5
    h-2/3 w-screen
    ">
    <a class="button absolute top-4 left-4 p-2 text-xl" href={resolve("/dashboard")}>DASHBOARD</a>
    <div class="container
    bg-linear-to-b from-gray-900 to-gray-800 from-20% to-100%
    h-screen w-2/3
    rounded-md
    relative
    overflow-hidden
        ">
        <!--        login/registration menu-->
        <div class="
        h-fit
        flex flex-row justify-evenly
        rounded-t-md
        relative
        z-50
        bg-position-50
        overflow-hidden
        before:bg-linear-to-r before:from-gray-900  before:via-slate-500 before:to-gray-900 before:from-20% before:to-80%
        before:h-100 before:w-[200%]
        before:absolute before:-left-4/5
        before:z-0
        has-[#register:hover]:before:-left-4/5 has-[#login:checked]:before:-left-1/5 has-[#login:hover]:before:-left-1/5
        before:-top-3
        before:duration-500 before:ease-out
        ">
            <input checked class="hidden peer/register" id="register" name="choose-auth" type="radio">
            <label class="menu-button
            not-peer-checked/register:hover:text-gray-50
            rounded-tl-md
            not-peer-checked/register:text-gray-300
            " for="register">
                Form
            </label>

            <input class="hidden peer/login" id="login" name="choose-auth" type="radio">
            <label class="menu-button
            rounded-tr-md
            not-peer-checked/login:text-gray-300
             not-peer-checked/login:hover:text-gray-50
            " for="login">
                Results
            </label>
        </div>
        <!--        actual forms-->
        <div class="form-container
        flex flex-row justify-evenly
        h-full w-[200%]
        duration-200
        z-50
        py-5
        absolute left-0
        before:w-1/4
        before:bg-gray-200
        before:h-0.5
        before:absolute before:left-0 before:top-0
        after:w-1/4
        after:bg-gray-200
        after:h-0.5
        after:absolute after:right-0 after:top-0
        ">
            <div class="register
                    h-full relative flex-1 overflow-scroll pb-20
                    ">
                <Form form={data.form}></Form>
            </div>

            <div class="login
            w-100 px-7 flex-1 overflow-scroll pb-20
            ">
                {#if !data.results}
                    <p class="text-neutral-400 text-center">The form isn't published yet!</p>
                {/if}
                {#each data.results as answer (answer.question.id)}
                    <Result result={answer}></Result>
                {/each}
            </div>
        </div>
    </div>
</div>

<style>
    @import "tailwindcss";

    .container:has(input#login:checked) .form-container {
        @apply -left-full;
    }

    .menu-button {
        @apply
        text-4xl text-gray-300 text-center
        w-full
        p-4
        ;
    }

    *:before {
        z-index: -1;
    }

    .button {
        @apply
        text-neutral-300 hover:text-gray-200 font-bold text-center
        border-2 border-gray-400 hover:border-gray-300 rounded-lg
        z-50
        /*relative*/
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
</style>