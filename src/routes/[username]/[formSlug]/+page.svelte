<script lang="ts">
    import Question from "./Question.svelte";
    import {enhance} from "$app/forms";

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

    const { data } = $props();

    const loadedForm = $derived(data.form as Form)
</script>

<form method="POST" action="?/send" use:enhance class="w-3/4 mx-auto bg-gray-700 h-min-full h-full">
    <p>{loadedForm.title}</p>
    <p>{loadedForm.description}</p>
    {#each loadedForm.questions as question, index (question)}
        <Question question={question}></Question>
    {/each}
</form>

<style>
    @import "tailwindcss";


</style>