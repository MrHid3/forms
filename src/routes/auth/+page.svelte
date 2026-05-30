<script lang="ts">
	import { enhance} from '$app/forms';
		import { browser } from '$app/environment';

	let { form } = $props();

	let showPassword = $state(false);
	let showPassword2 = $state(false);
	let password = $state('');

	const usernameRegex = '[a-z0-9]{3,50}';
</script>

<div class="
    flex flex-col justify-center items-center gap-5
    h-2/3 w-screen
    ">
	<div class="container
    bg-linear-to-b from-gray-900 to-gray-800 from-20% to-100%
    h-100 w-100
    rounded-md
    relative
    overflow-hidden
        ">
		<!--        login/registration menu-->
		<div class="
        h-9
        flex flex-row justify-evenly
        rounded-t-md
        relative
        z-50
        bg-position-50
        overflow-hidden
        before:bg-linear-to-r before:from-gray-900  before:via-slate-500 before:to-gray-900 before:from-20% before:to-80%
        before:h-100 before:w-200
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
		<!--        actual forms-->
		<div class="form-container
        flex flex-row justify-evenly
        h-full w-200
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
                    h-full w-100 px-7
                    ">
				<form action="?/register" use:enhance class="
                flex flex-col justify-baseline items-center gap-4
                h-full
                p-7
                " method="POST">
					<input class="
                    input
                    " name="username" placeholder="u$ernam3" required type="text" pattern={usernameRegex}
					       autocomplete="off">
					<input bind:value={password} class="
                    input
                    " name="password" placeholder="very_$afe+Password"
					       pattern={"^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+\\-]).{8,12}$"}
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
					{#if form?.type == "register"}
						<p class="
						text-gray-200 text-center
						">{form?.res.message}</p>
					{/if}
				</form>
			</div>

			<div class="login
            w-100 px-7
            ">
				<form action="?/login" method="POST" use:enhance class="
                flex flex-col justify-baseline items-center gap-4
                h-full
                p-7
                ">
					<input class="
                    input
                    " name="username" placeholder="username" required type="text">
					<input bind:value={password} class="
                    input
                    " name="password" placeholder="password"
					       required type={showPassword2 ? "text" : "password"}>
					<label class="
                    text-gray-200
                    text-left
                    w-80
                    " for="show-password2">
						Show password
						<input bind:checked={showPassword2} class="
                        accent-blue-500
                        border-0
                        bg-slate-700
                        rounded-sm
                        " id="show-password2" type="checkbox">
					</label>
				  {#if browser && (new URLSearchParams(window.location.search)).get("after")}
					<input type="hidden" name="after" value={(new URLSearchParams(window.location.search)).get("after")}>
					{/if}
					<button class="button p-1" type="submit">LOGIN</button>
					{#if form?.type == "login"}
						<p class="
						text-gray-200 text-center
						">{form?.res.message}</p>
					{/if}
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
        bg-linear-to-t from-slate-700 to-slate-600
        border-0
        rounded-sm
        text-gray-200
        focus:ring-2
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

    * {
        @apply ring-slate-400 focus:ring-1;
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