<script lang="ts">

    import { resolve } from '$app/paths';

    let showPassword = $state(false);
    let password = $state("");
</script>

<div class="
    flex flex-col justify-center items-center gap-5
    h-2/3 w-screen
    ">
    <div class="container
    bg-gray-900
    h-100 w-100
    rounded-md
    relative
    overflow-hidden
        ">
        <div class="
        group
        bg-gray-500
        h-9
        flex flex-row justify-evenly
        rounded-t-md
<!--        border-b-2 border-b-gray-400-->
        before:bg-radial  before:from-gray-300 before:via-blue-500 before:to-gray-300 before:from-20% before:via-50% before:to-85%
        before:h-100 before:w-200
        before:absolute
        relative
        before:z-0
        z-50
        before:-left-4/5
        has-[#login:checked]:before:-left-1/5
        before:bottom-0
        before:duration-300
        bg-position-50
        overflow-hidden
        ">
            <input type="radio" class="hidden peer/register" id="register" name="choose-auth" checked>
            <label for="register" class="menu-button
            not-peer-checked/register:hover:text-gray-50
            rounded-tl-md
            not-peer-checked/register:text-gray-300
            ">
                REGISTER
            </label>
            <input type="radio" class="hidden peer/login" id="login" name="choose-auth">
            <label for="login" class="menu-button
            rounded-tr-md
            not-peer-checked/login:text-gray-300
             not-peer-checked/login:hover:text-gray-50
            ">
                LOGIN
            </label>
        </div>
        <div class="form-container
        absolute left-0
        flex flex-row
        h-100 w-200
        duration-200
        ">

            <div class="register
                    h-100 w-100
                    ">
                <form action="?/register" method="POST" class="
                flex flex-col justify-center items-center gap-4
                p-4
                ">
                    <input type="email" name="email" required placeholder="email@example.com" class="
                input
                ">
                    <input type={showPassword ? "text" : "password"} name="password" bind:value={password} required placeholder="very_$afe+Password" class="
                input
                ">
                    <input type={showPassword ? "text" : "password"} pattern={password} required placeholder="rep3at_passw0rd" class="
                input
                ">
                    <label for="show-password" class="
                    text-gray-200
                    ">
                        Pokaż hasło
                        <input type="checkbox" id="show-password" bind:checked={showPassword} class="
                        accent-blue-500
                        border-0
                        bg-gray-950
                        ">
                    </label>
                    <button type="submit">Register</button>
                </form>
            </div>
            <div class="login
                    hidden
                    ">

            </div>
        </div>
    </div>
    <a href={resolve('/')} class="text-gray-50 hover:text-gray-800 text-1xl bg-blue-500 hover:bg-blue-300 duration-300 border-2 border-gray-700 hover:border-blue-300 rounded-md p-3 cursor-pointer">Go back</a>
</div>

<style>
    @import "tailwindcss";

    /*.container:has(input#login:checked) .login,*/
    /*.container:has(input#register:checked) .register*/
    /*{*/
    /*    display: block !important;*/
    /*}*/

    .container:has(input#login:checked) .form-container {
        @apply -left-full;
    }

    .input
    {
        @apply
        w-80
        bg-slate-700
        border-0
        rounded-sm;
    }

    .menu-button{
        @apply
        text-gray-200 font-bold
        duration-150
        cursor-pointer text-center
        flex-1
        z-50
        flex items-center justify-center
        text-shadow-black/20 text-shadow-sm
        select-none
        ;
    }
</style>