<script lang="ts">
	import Question from './Question.svelte';
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
		import { untrack } from 'svelte';

	interface rangeSettings {
		min: number,
		max: number,
		step: number
	}

	interface Question {
		id: number,
		type: string,
		order: number,
		required: boolean,
		content: string,
		answers: { id: number, content: string }[] | rangeSettings | null
	}

	interface Form {
		id: number,
		title: string,
		description: string,
		slug: string,
		owner: string,
		isPublished: boolean,
		requireLogin: boolean,
		shuffleQuestions: boolean,
		createdAt: Date,
		questions: Question[],
	}

	function shuffle(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}

	const { data, form } = $props();
	const loadedForm = $derived(data.form) as Form | null;

	let submitted = $state(form?.success);

	$effect(() => {
		form?.success;
		untrack(() => {
			submitted = form?.success;

		});
	});
</script>

{#if submitted}
  <p class="text-gray-300 mx-auto text-center text-2xl">Your answers have been submitted!</p>
  {#if !loadedForm?.requireLogin}
	<button class="text-blue-500 w-fit block mx-auto text-center text-xl cursor-pointer"
	        onclick={() => submitted = false}>Answer the questions again
	</button>
  {/if}
{:else}
  {#if data.error == "No token provided"}
	<p class="text-gray-300 text-4xl">Login is required for this form</p>
	<a href={resolve(`/auth?after=${encodeURI(`answer/${data.url}`)}`)} class="text-blue-400">Go to login</a>
  {:else if data.error}
	<p class="text-gray-300 text-4xl">{data.error}</p>
	<a href={resolve(`/auth?after=${encodeURI(`answer/${data.url}`)}`)} class="text-blue-400">Go to dashboard</a>
  {:else}
	<form action="?/send" class="w-3/4 mx-auto bg-gray-700 h-min-full h-full" method="POST" use:enhance>
	  <input type="hidden" name="formId" value={loadedForm?.id}>
	  <p>{loadedForm?.title}</p>
	  <p>{loadedForm?.description}</p>
	  {#each shuffle(loadedForm?.questions) as question, index (question)}
		<Question question={question}></Question>
	  {/each}
	  <button class="button text-8xl w-3/4" type="submit">Submit</button>
	</form>
  {/if}
{/if}

<style>
    @import "tailwindcss";

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

	*:before{
		z-index: -1
	}

</style>