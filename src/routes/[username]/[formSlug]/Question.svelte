<script lang="ts">
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

    const { question } : {question: Question} = $props();
    let rangeValue = $state(question.answers?.min ? (question.answers?.min + question.answers.max)/2 - ((question.answers.min + question.answers.max) % question.answers.step) : 0)

</script>

<div class="text-2xl text-gray-200 p-4 flex flex-col">
    <p>{question.content}{question.required? "*" : ""}</p>
    {#if question.type === "short answer" }
        <input type="text" name={question.id.toString()} maxlength="20" required={question.required}/>
    {:else if question.type === "long answer"}
        <textarea name={question.id.toString()} cols="30" rows="10"></textarea>
    {:else if question.type === "single choice" || question.type === "multiple choice"}
        {@const  inputType= question.type === "single choice" ? "radio" :"checkbox" }
        <div class="flex flex-col gap-2">
            {#each question.answers as answer (answer.id)}
                <div class="flex flex-row w-full justify-between">
                    <label for="choice-{question.id}-{answer.id}"
                           class="flex flex-row wrap-normal border-2 border-gray-500 choice-label items-center gap-3 p-1 rounded-xl text-gray-300">
                        <input type={inputType}
                               value={answer.id} id="choice-{question.id}-{answer.id}" name={question.id.toString()}>
                        <span class="text-gray-300">{answer.content}</span>
                    </label>
                </div>
            {/each}
        </div>

    {:else if question.type === "range" && question.answers}
        <input type="range" min={question.answers?.min} max={question.answers?.max} step={question.answers?.step} value={rangeValue} name={question.id.toString()}>
        <div class="flex flex-row justify-between">
            <span class="text-gray-300">Min: {question.answers.min}</span>
            <span class="text-gray-300">Step: {question.answers.step}</span>
            <span class="text-gray-300">Max: {question.answers.max}</span>
        </div>
    {/if}
</div>

<style>
    @import "tailwindcss";

    input[type="radio"]{
        border-radius: 100%;
    }
</style>
