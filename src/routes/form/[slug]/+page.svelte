<script lang="ts">
    import { enhance} from '$app/forms';

    const { data, form } = $props();

    const loadedForm = $derived(data.form as Form)

    // console.log(form);

    let editMode = $state(false)

    interface rangeSettings {
        min: number,
        max: number,
        step: number
    }

    interface Question{
        id: number,
        type: string,
        order: number,
        required: boolean,
        content: string,
        answers: {id: number, content: string} | rangeSettings | null
    }

    interface Form {
        id: number,
        title: string,
        description: string,
        slug: string,
        owner: string,
        isPublished: boolean,
        createdAt: Date,
        questions: Question[],
    }

    const questionTypes = [
        {value: "short answer", displayName: "Short answer"},
        {value: "long answer", displayName: "Long answer"},
        {value: "single choice", displayName: "Single choice"},
        {value: "multiple choice", displayName: "Multiple choice"},
        {value: "range", displayName: "Range"}
    ]

    let selectedQuestionType : string = $state(questionTypes[0].value);
    let choice : string = $state("");

    let choices : string[] = $state([])

    const addChoice = () => {
        if(choices.includes(choice)) return;
        choices.push(choice);
        choice = "";
    }

    const removeChoice = (choiceToRemove: string) => {
        choices = choices.filter((i) => i !== choiceToRemove);
    }

    if(form?.success){
        choices = [];
    }
</script>

<a href="/dashboard" class="button p-1 absolute top-4 left-4">&#9664; DASHBOARD</a>

<div class="
w-3/5 h-full
bg-linear-to-b from-gray-900 to-gray-800 from-20% to-100%
mx-auto
px-4
relative
flex flex-col gap-4
">
    {#if !loadedForm.isPublished}
        <input type="checkbox" class="hidden peer/edit" bind:checked={editMode} id="editModeCheckbox">
        <label for="editModeCheckbox" class="button p-1 text-4xl w-14 h-14 absolute top-4 right-4 peer-checked/edit:rotate-90 hover:rotate-90">&#9998;</label>
    {:else}
        <button type="button" class="button p-1 text-4xl w-14 h-14 fixed top-4 right-[21%]">Usuń</button>
    {/if}
    {#if !editMode}
        <p class="text-6xl text-white text-center font-bold pt-5 pb-3">{loadedForm.title}</p>
        <div class="bg-gray-400 w-3/4 mx-auto h-px"></div>
        <p class="text-gray-500 text-center">{loadedForm.description}</p>
        {#each loadedForm.questions as question (question.id)}
            <div class="text-2xl text-gray-200 p-4 flex flex-col">
                <span>{question.content}</span>
                {#if question.type === "short answer" || question.type === "long answer"}
                    <input type="text" disabled placeholder="Answer">
                {:else if question.type === "single choice" && Array.isArray(question.answers)}
                    {#each question.answers as answer (answer.id)}
                        <label for={`answer-${question.id}-${answer.id}`}>
                            <input type="radio" name={`answer-radio-${question.id}`} id={`answer-${question.id}-${answer.id}`} class="input-radio" disabled>
                            <span class="text-gray-300">{answer.content}</span>
                        </label>
                    {/each}
                {:else if question.type === "multiple choice" && Array.isArray(question.answers)}
                    {#each question.answers as answer (answer.id)}
                        <label for={`answer-${question.id}-${answer.id}`}>
                            <input type="checkbox" id={`answer-${question.id}-${answer.id}`} disabled>
                            <span class="text-gray-300">{answer.conetn}</span>
                        </label>
                    {/each}
                {/if}
            </div>
            <div class="w-4/5 h-px border-b-gray-400 border-2 mx-auto"></div>
        {/each}

        <div class="border-2 border-gray-200 h-fit w-full p-4 rounded-xl">
            <form action="?/addQuestion" method="POST" class="flex flex-col gap-4 text-gray-200" use:enhance>
                <input type="hidden"  name="formId" value={loadedForm.id}>
                <select name="questionType" bind:value={selectedQuestionType} class="button" required>
                    {#each questionTypes as type (type.value)}
                        <option value={type.value}>{type.displayName}</option>
                    {/each}
                </select>
                <input type="text" name="content" maxlength="4000" minlength="1" placeholder="Question" required>
                {#if selectedQuestionType === "single choice" || selectedQuestionType === "multiple choice"}
                    <input type="text" id="addChoice" placeholder="Choice 1" bind:value={choice}>
                    <button type="button" onclick={() => addChoice()} class="button w-fit p-2 text-1xl">Add choice</button>
                    <div class="flex flex-row gap-2">
                        {#each Array.from(choices) as newChoice (newChoice)}
                            <label for="new-choice-{newChoice}" class="flex flex-row wrap-normal border-2 border-gray-200 choice-label">
                                <input type="checkbox" name="answers" value={newChoice} class="hidden" checked>
                                <input type={selectedQuestionType === "single choice" ? "radio" :"checkbox"} disabled value={newChoice} id="new-choice-{newChoice}" class={selectedQuestionType === "single choice" ? "input-radio" : "input-checkbox"}>
                                <span>{newChoice}</span>
                                <button type="button" class="button self-end w-7 h-7" onclick={() => removeChoice(newChoice)}>X</button>
                            </label>
                        {/each}
                    </div>
                {:else if selectedQuestionType === "range"}
                    <input type="number" name="min" required placeholder="Min">
                    <input type="number" name="max" required placeholder="Max">
                    <input type="number" name="step" required placeholder="Step">
                {/if}
                <label for="requiredCheckbox" class="flex flex-row items-center gap-2">
                    <input type="checkbox" name="required" id="requiredCheckbox">
                    Required
                </label>
                <button type="submit" class="button w-fit p-2 text-1xl self-end">Add</button>
            </form>
        </div>
    {/if}


</div>

<style>
    @import "tailwindcss";

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

    .input-radio{
        @apply
            text-gray-300 text-2xl
            rounded-full
            accent-red-300
        ;
    }

    .choice-label{
        @apply
            w-fit
            border-2 border-gray-400 rounded-md p-2 flex flex-row items-center gap-2
        ;
    }
</style>