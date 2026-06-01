<script lang="ts">
    import {tick, untrack} from 'svelte';

    interface Question {
        id: number,
        type: string,
        order: number,
        required: boolean,
        content: string,
        answers: Answer[] | RangeSettings | null
    }

    interface RangeSettings {
        min: number,
        max: number,
        step: number
    }

    interface Answer {
        id: number,
        content: string
    }

    let {question = $bindable(), deleteMe, published}: {
        question: Question,
        deleteMe: () => void,
        published: boolean
    } = $props();

    const questionTypes = [
        {value: 'short answer', displayName: 'Short answer'},
        {value: 'long answer', displayName: 'Long answer'},
        {value: 'single choice', displayName: 'Single choice'},
        {value: 'multiple choice', displayName: 'Multiple choice'},
        {value: 'range', displayName: 'Range'}
    ];

    const removeChoice = (choiceToRemove: Answer) => {
        const index = question.answers?.findIndex(e => e == choiceToRemove);
        question.answers?.splice(index, 1);
    };

    const addAnswer = async () => {
        question.answers?.push({id: question.answers?.length + 1, content: ''} as Answer);
        await tick();
        const inputs: NodeListOf<HTMLInputElement> = document.querySelectorAll(`input.answerInput-${question.id}`);
        inputs[inputs.length - 1].focus();
    };

    $effect(() => {
        question.type;
        untrack(() => {
            if (question.type === 'range' && (Array.isArray(question.answers) || question.answers == null)) {
                question.answers = {min: 0, max: 100, step: 5} as RangeSettings;
            } else if ((question.type === 'multiple choice' || question.type === 'single choice') && (!Array.isArray(question.answers) || question.answers == null)) {
                question.answers = [{id: 1, content: 'Option 1'} as Answer];
            }
        });
    });


</script>

<div class="text-2xl text-gray-200 p-4 flex flex-col relative">
    <div class="flex flex-row">
        <input autocomplete="off" bind:value={question.content} class="input-stealth my-2" disabled={published}
               placeholder="Question">
        <select autocomplete="" bind:value={question.type} class="button rounded-r-none! w-100" disabled={published}
                name="questionType" required>
            {#each questionTypes as type (type.value)}
                <option value={type.value}>{type.displayName}</option>
            {/each}
        </select>
        {#if !published}
            <button onclick={deleteMe} class="button p-3 w-20 rounded-l-none!">X</button>
        {/if}
    </div>
    {#if question.type === "short answer" }
        <span class="italic font-light text-neutral-400">Short answer text</span>
    {:else if question.type === "long answer"}
        <textarea class="italic font-light text-neutral-300" disabled>Long answer text</textarea>
    {:else if question.type === "single choice" || question.type === "multiple choice"}
        {@const inputType = question.type === "single choice" ? "radio" : "checkbox" }
        <div class="flex flex-col gap-2">
            {#each question.answers as answer (answer.id)}
                <div class="flex flex-row w-full justify-between">
                    <label for="new-choice-{answer}"
                           class="flex flex-row wrap-normal border-2 border-gray-500 choice-label items-center gap-3 p-1 rounded-xl text-gray-300">
                        <input type={inputType} disabled
                               value={answer} id="new-choice-{answer}">
                        <input type="text" bind:value={answer.content} placeholder={`Option ${answer.id}`}
                               class={`answerInput-${question.id}`} autocomplete="off">
                    </label>
                    {#if !published}
                        <button type="button" class="button self-end w-7 h-7" onclick={() => removeChoice(answer)}>X
                        </button>
                    {/if}
                </div>
            {/each}
            {#if !published}
                <div class="flex flex-row">
                    <input type={inputType} disabled>
                    <input type="text" placeholder="Add option" onclick={() => addAnswer()} autocomplete="off">
                </div>
            {/if}
        </div>

    {:else if question.type === "range" && question.answers}
        <input type="range" min={question.answers?.min} max={question.answers?.max} step={question.answers?.step}
               disabled>
        <div class="flex flex-row justify-between">
            <div class="flex flex-col">
                Min:
                <input type="number" bind:value={question.answers.min} class="w-1/2" autocomplete="off"
                       disabled={published}>
            </div>
            <div class="flex flex-col text-center">
                Step:
                <input type="number" bind:value={question.answers.step} class="w-1/2 self-center" autocomplete="off"
                       disabled={published}>
            </div>
            <div class="flex flex-col text-end">
                Max:
                <input type="number" bind:value={question.answers.max} class="w-1/2 self-end" autocomplete="off"
                       disabled={published}>
            </div>
        </div>
    {/if}
    <label class="self-end" for={`required-${question.id}`}>
        <span>Required</span>
        <input bind:checked={question.required} disabled={published} id={`required-${question.id}`} type="checkbox">
    </label>
</div>

<div class="w-4/5 h-px border-b-gray-400 border-2 mx-auto"></div>

<style>
    @import "tailwindcss";

    .input-stealth {
        @apply
        w-full
        text-gray-300 focus:text-gray-100
        border-0 border-b-2  border-b-transparent focus:border-gray-600
        duration-200
        focus:ring-0 ring-0 active:ring-0
        box-border
        bg-neutral-700/20 focus:bg-neutral-700/40
        ;
        transition-property: border-color, color, padding;
    }

    input[type="radio"] {
        border-radius: 50%;
    }

    .button {
        @apply
        text-neutral-300 hover:text-gray-200 font-bold text-center
        border-2 border-gray-400 hover:border-gray-300 rounded-lg
        z-20
        relative
        overflow-hidden!
        cursor-pointer
        before:bg-linear-to-r before:from-gray-900  before:via-slate-500 before:to-gray-900 before:from-20% before:to-80%
        before:h-[200%] before:w-[200%]
        before:absolute before:-left-full
        hover:before:-left-0
        before:-top-3
        before:duration-500 before:ease-out
        text-shadow-md text-shadow-black/40
        duration-150
        ;
    }

    *:before {
        z-index: -1;
    }
</style>