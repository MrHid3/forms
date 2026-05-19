<script lang="ts">

    import {resolve} from '$app/paths';

    let showPassword = $state(false);
    let password = $state("");

    const usernameRegex = "[a-z0-9]{3,50}";

</script>

<div class="
    flex flex-col justify-center items-center gap-5
    h-2/3 w-screen
    ">
    <div class="container
    bg-gray-900
    h-90 w-100
    rounded-md
    relative
    overflow-hidden
        ">
        <div class="
        group
        h-9
        flex flex-row justify-evenly
        rounded-t-md
        relative
        z-50
        bg-position-50
        overflow-hidden
        before:bg-linear-to-r before:from-gray-900  before:via-slate-500 before:to-gray-900 before:from-20% before:to-80%
        before:h-100 before:w-200
        before:absolute
        before:z-0
        before:-left-4/5
        has-[#register:hover]:before:-left-4/5
        has-[#login:checked]:before:-left-1/5
        has-[#login:hover]:before:-left-1/5
        before:-top-3
        before:duration-500 before:ease-out
        ">
            <input checked class="hidden peer/register" id="register" name="choose-auth" type="radio">
            <label class="menu-button
            not-peer-checked/register:hover:text-gray-50
            rounded-tl-md
            not-peer-checked/register:text-gray-300
            " for="register">
                REGISTER
            </label>
            <input class="hidden peer/login" id="login" name="choose-auth" type="radio">
            <label class="menu-button
            rounded-tr-md
            not-peer-checked/login:text-gray-300
             not-peer-checked/login:hover:text-gray-50
            " for="login">
                LOGIN
            </label>
        </div>
        <div class="form-container
        absolute left-0
        flex flex-row justify-evenly
        h-full w-200
        duration-200
        z-50
        py-5
        ">

            <div class="register
                    h-full w-100 px-7
                    ">
                <form action="?/register" class="
                flex flex-col justify-baseline items-center gap-4
                h-full
                p-7
                " method="POST">
                    <input class="
                    input
                    " name="email" placeholder="u$ernam3" required type="text" pattern={usernameRegex} autocomplete="off">
                    <input bind:value={password} class="
                    input
                    " name="password" placeholder="very_$afe+Password" pattern={"^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+\\-]).{8,12}$"}
                           required type={showPassword ? "text" : "password"}>
                    <input class="
                    input
                    " pattern={password} placeholder="rep3at_passw0rd"
                    required type={showPassword ? "text" : "password"}>
                    <label class="
                    text-gray-200
                    text-left
                    w-80
                    " for="show-password">
                        Show password
                        <input bind:checked={showPassword} class="
                        accent-blue-500
                        border-0
                        bg-slate-700
                        rounded-sm
                        " id="show-password" type="checkbox">
                    </label>
                    <button class="button p-1" type="submit">REGISTER</button>
                </form>
            </div>
            <div class="login
            w-100 px-7
            ">
                <form action="?/login" method="POST" class="
                flex flex-col justify-baseline items-center gap-4
                h-full
                p-7
                ">
                    <input class="
                    input
                    " name="email" placeholder="username" required type="text">
                    <input bind:value={password} class="
                    input
                    " name="password" placeholder="password"
                           required type={showPassword ? "text" : "password"}>
                    <label class="
                    text-gray-200
                    text-left
                    w-80
                    " for="show-password">
                        Show password
                        <input bind:checked={showPassword} class="
                        accent-blue-500
                        border-0
                        bg-slate-700
                        rounded-sm
                        " id="show-password" type="checkbox">
                    </label>
                    <button class="button p-1" type="submit">LOGIN</button>
                </form>
            </div>
        </div>
    </div>
</div>

<style>
    @import "tailwindcss";

    .container:has(input#login:checked) .form-container {
        @apply -left-full;
    }

    .input {
        @apply
        w-80
            bg-slate-700
            border-0
            rounded-sm
            text-gray-200
            ring-slate-400
        ;
    }

    .menu-button {
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

    *::before {
        z-index: -1;
    }

    .link {
        @apply
        text-gray-50 hover:text-white text-xl
        duration-300
        border-2 border-gray-50/60 hover:border-gray-50
        rounded-md
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
</style>