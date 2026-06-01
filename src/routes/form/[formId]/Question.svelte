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
        question.answers?.length;
        untrack(() => {
            if(Array.isArray(question.answers) && question.answers.length == 0){
                addAnswer();
            }
        })
    })

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
    <div class="flex flex-row justify-between">
        <div class="input-steal-container w-full!">
            <input autocomplete="off" bind:value={question.content} class="input-stealth my-2 w-full!" disabled={published}
                   placeholder="Question">
        </div>
        <div class="flex items-center">
            <select autocomplete="" bind:value={question.type} class="button rounded-r-none! w-100 h-15" disabled={published}
                    name="questionType" required>
                {#each questionTypes as type (type.value)}
                    <option value={type.value}>{type.displayName}</option>
                {/each}
            </select>
            {#if !published}
                <button onclick={deleteMe} class="button h-15 w-15 rounded-l-none!">X</button>
            {/if}

        </div>
    </div>
    {#if question.type === "short answer" }
        <span class="italic font-light text-neutral-400 px-6">Short answer text</span>
    {:else if question.type === "long answer"}
        <textarea class="italic font-light text-neutral-400 rounded-lg m-2" disabled>Long answer text</textarea>
    {:else if question.type === "single choice" || question.type === "multiple choice"}
        {@const inputType = question.type === "single choice" ? "radio" : "checkbox" }
        <div class="flex flex-col gap-2">
            {#each question.answers as answer (answer.id)}
                <div class="flex flex-row w-full justify-between items-center">
                    <label for="new-choice-{answer}"
                           class="flex flex-row items-center gap-2 w-max-1/2 overflow-hidden">
                        <input type={inputType} disabled
                               value={answer} id="new-choice-{answer}">
                        <span class="input-steal-container w-fit">
                            <input type="text" bind:value={answer.content} placeholder={`Option ${answer.id}`} disabled={published}
                                   class={`answerInput-${question.id} input-stealth w-fit!`} autocomplete="off" size={answer.content.length < 9 ? 15 : answer.content.length < 30 ? (Math.ceil(answer.content.length / 5) + 1) * 5 : 35}>
                        </span>
                    </label>
                    {#if !published}
                        <div class="w-1/2 h-px border-1 border-slate-600"></div>
                        <button type="button" class="button w-10 h-10" onclick={() => removeChoice(answer)}>X
                        </button>
                    {/if}
                </div>
            {/each}
            {#if !published}
                <div class="flex flex-row items-center gap-2">
                    <input type={inputType} disabled>
                    <span class="input-steal-container">
                        <input type="text" class="input-stealth" placeholder="Add option" onclick={() => addAnswer()} autocomplete="off" size="15">
                    </span>
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
    <label class="self-end flex items-center gap-2" for={`required-${question.id}`}>
        <span>Required</span>
        <span class="switch">
            <input bind:checked={question.required} disabled={published} id={`required-${question.id}`} type="checkbox" class="hidden">
        </span>
    </label>
</div>

<div class="w-4/5 h-px border-b-gray-400 border-2 mx-auto"></div>

<style>
    @import "tailwindcss";

    input[type="radio"] {
        border-radius: 50%;
    }

    .input-stealth {
        @apply
        w-fit
        duration-200
        focus:ring-0 ring-0 active:ring-0
        border-0
        box-border
        text-neutral-400 hover:text-neutral-200 focus:text-neutral-200
        ;
        transition-property: border-color, color, padding, background-color;
    }

    .input-steal-container {
        @apply
        w-fit h-fit
        relative
        overflow-hidden
        before:bg-linear-to-t before:from-slate-400 before:to-black/20 before:to-70%
        before:h-[400%] before:w-full
        before:absolute before:-top-1/4 before:left-0
        not-has-[input:disabled]:hover:before:-top-3/4 has-focus-within:before:-top-3/4
        before:duration-200
        rounded-xl
        m-5
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
        block
        before:bg-linear-to-r before:from-gray-900 before:via-slate-500 before:to-gray-900 via-30%
        before:absolute before:-left-4/5 before:top-0 before:h-full before:w-[200%]
        has-checked:before:-left-1/5
        before:duration-150
        before:ease-in-out
        after:rounded-full after:h-full after:w-1/2 after:absolute after:left-0 after:bg-white/40 has-checked:after:left-1/2 after:duration-200 has-checked:after:bg-white/70
        ;
    }

    *:before {
        z-index: -1;
    }

    input[type='number']::-webkit-outer-spin-button,
    input[type='number']::-webkit-inner-spin-button,
    input[type='number'] {
        -webkit-appearance: none;
        margin: 0;
        -moz-appearance: textfield !important;
    }

    .button {
        @apply
        text-neutral-300 hover:text-gray-200 font-bold text-center
        border-2 border-gray-400 hover:border-gray-300 rounded-lg
        z-20
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
</style>