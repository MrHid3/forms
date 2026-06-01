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

    function enforceCheckboxRequired(e: Event) {
        const form = (e.target as HTMLElement).closest('form');
        if (!form) return;
        if (question.type === "multiple choice" && question.required) {
            const boxes = form.querySelectorAll<HTMLInputElement>(
              `input[type="checkbox"][name="${question.id}"]`
            );
            const anyChecked = Array.from(boxes).some(b => b.checked);
            boxes.forEach(b => b.setCustomValidity(anyChecked ? "" : "Please select at least one option."));
        }
    }
</script>

<div class="text-2xl text-gray-200 p-4 flex flex-col gap-4">
    <p>{question.content}{question.required? "*" : ""}</p>
    <div class="w-1/6 h-px border border-gray-600 "></div>
    {#if question.type === "short answer" }
        <input type="text" name={question.id.toString()} maxlength="20" required={question.required} class="input" placeholder="Answer"/>
    {:else if question.type === "long answer"}
        <textarea name={question.id.toString()} cols="30" rows="10" required={question.required} class="input w-full!" placeholder="Your very long and exhaustive answer..."></textarea>
    {:else if question.type === "single choice" || question.type === "multiple choice"}
        {@const  inputType= question.type === "single choice" ? "radio" :"checkbox" }
        <div class="flex flex-col gap-2">
            {#each question.answers as answer (answer.id)}
                <div class="flex flex-row w-full justify-between items-center">
                    <label for={`choice-${question.id}-${answer.id}`}
                           class="flex flex-row wrap-normal items-center gap-3 p-1 rounded-xl text-gray-300 justify-baseline choice-label">
                        <input type={inputType}
                               value={answer.id} id={`choice-${question.id}-${answer.id}`} name={question.id.toString()} required={question.required && inputType == "radio"} onchange={enforceCheckboxRequired}
                        class="text-blue-500"/>
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

    .choice-label{
       @apply
            bg-gray-800/60
           rounded-xl
           p-2
           w-full
           has-[input:checked]:bg-gray-800
        ;
    }
</style>
