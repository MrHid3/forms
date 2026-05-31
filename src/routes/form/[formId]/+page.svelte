<script lang="ts">
	import Form from './Form.svelte';
	import Result from './Result.svelte';

	const { data, form } = $props();
</script>


<div class="
    flex flex-col justify-center items-center gap-5
    h-2/3 w-screen
    ">
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
        text-gray-200 font-bold text-center hover:text-gray-900
        border-2 border-gray-200 hover:border-transparent
        rounded-sm
        cursor-pointer
        duration-300
        hover:bg-gray-50
        ;
    }
</style>