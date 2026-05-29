<script lang="ts">
    import {enhance} from '$app/forms';
    import Question from "./Question.svelte";
    import {PUBLIC_BACKEND_URL} from "$env/static/public";
    import {onMount, untrack} from "svelte";
    import {invalidate} from "$app/navigation";
    import {browser} from "$app/environment";
    import { page } from '\$app/state';

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

    const {data, form} = $props();

    let loadedForm = $state(data.form as Form)

    $effect(() => {
        data.form;
        untrack(() => {
            loadedForm = data.form
            saveForm()
        })
    })

    let oldForm: Form;
    let autoSaveIntervalSeconds: number = $state(5);
    if (browser) {
        autoSaveIntervalSeconds = parseInt(localStorage.getItem("autoSaveIntervalSeconds") ?? "5");
    }

    const saveForm = () => {
        oldForm = structuredClone($state.snapshot(loadedForm))
    }

    const findDiff = (form1: Form, form2: Form) => {
        let diff = {};
        diff.questions = [];

        if (form1.title != form2.title) {
            diff.title = form2.title;
        }
        if (form1.description != form2.description) {
            diff.description = form2.description;
        }
        if (form1.slug != form2.slug) {
            diff.slug = form2.slug;
        }
        if (form1.shuffleQuestions != form2.shuffleQuestions) {
            diff.shuffleQuestions = form2.shuffleQuestions;
        }
        if (form1.requireLogin != form2.requireLogin) {
            diff.requireLogin = form2.requireLogin;
        }
        if (JSON.stringify(form1.questions) != JSON.stringify(form2.questions)) {
            for (let question of form1.questions) {
                const str = JSON.stringify(question);
                if (!form2.questions.some(a => JSON.stringify(a) == str)) {
                    diff.questions.push(question);
                }
            }
            for (let i = 0; i < diff.questions.length; i++) {
                const found = form2.questions.find(a => a.id == diff.questions[i].id);
                if (!found) {
                    diff.questions[i].toDelete = true;
                } else {
                    diff.questions[i] = found
                }
            }
        }
        for (let question of form2.questions) {
            if (question.id < 0) {
                diff.questions.push(question);
            }
        }
        return diff;
    }

    const saveChanges = async () => {
        const diff = findDiff(oldForm, loadedForm);

        if (diff.title || diff.description || diff.slug) {
            await fetch(`${PUBLIC_BACKEND_URL}/form/${loadedForm.id}`, {
                method: 'PUT',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(diff),
            })
        }

        for (let q of diff.questions) {
            if (q.toDelete) {
                await fetch(`${PUBLIC_BACKEND_URL}/question/${q.id}`, {
                    method: 'DELETE',
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
            } else if (q.id < 0) {
                await fetch(`${PUBLIC_BACKEND_URL}/form/${loadedForm.id}/add-question`, {
                    method: 'POST',
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        content: q.content,
                        answers: Array.isArray(q.answers) ? q.answers.map(a => a.content) : q.answers,
                        type: q.type,
                        required: q.required,
                    }),
                })
            } else {
                await fetch(`${PUBLIC_BACKEND_URL}/question/${q.id}`, {
                    method: 'PUT',
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        content: q.content,
                        answers: Array.isArray(q.answers) ? q.answers.map(a => a.content) : q.answers,
                        type: q.type,
                        required: q.required,
                    }),
                })
            }
        }
        await invalidate(`${PUBLIC_BACKEND_URL}/form/${loadedForm.id}`);
        console.log("form saved");
    }

    const addQuestion = () => {
        loadedForm.questions.push({
            id: -loadedForm.questions.length - 1,
            type: "single choice",
            order: loadedForm.questions.length,
            required: false,
            content: `Question ${loadedForm.questions.length + 1}`,
            answers: [{id: 0, content: "Option 1"}]
        } as Question);
    }

    const removeQuestion = (id: number) => {
        const index = loadedForm.questions.findIndex(q => q.id == id);
        loadedForm.questions.splice(index, 1);
    }

    saveForm();

    $effect(() => {
        if (loadedForm.questions.length == 0) {
            addQuestion();
        }
    })

    $effect(() => {
        autoSaveIntervalSeconds;
        untrack(() => {
            if (browser)
                localStorage.setItem("autoSaveIntervalSeconds", (autoSaveIntervalSeconds ?? "0").toString())
        })
    })

    let saveInterval: any;
    const restartTimer = () => {
        clearTimeout(saveInterval);
        saveInterval = setTimeout(saveChanges, autoSaveIntervalSeconds * 1000)
    }

    $effect(() => {
        JSON.stringify(loadedForm);
        untrack(() => {
            restartTimer()
        })
    })

</script>

//TODO: disable edits if poll published
<a class="button p-1 absolute top-4 left-4" href="/dashboard">&#9664; DASHBOARD</a>
<button class="button p-1 absolute top-4 right-4" onclick={() => saveChanges()}>save</button>
<input bind:value={autoSaveIntervalSeconds} class="p-1 absolute top-14 right-4 text-gray-300" type="number">
<label class="absolute text-gray-300 p-1 top-24 right-4" for="shuffleQuestions">
    Shuffle questions
    <input bind:checked={loadedForm.shuffleQuestions} class="text-blue-500" id="shuffleQuestions" type="checkbox">
</label>
<label class="absolute text-gray-300 p-1 top-34 right-4" for="requireLogin">
    Require login
    <input bind:checked={loadedForm.requireLogin} class="text-blue-500" id="requireLogin" type="checkbox">
</label>
<form action="?/delete" method="post" use:enhance>
    <input type="hidden" value={loadedForm.id} name="formId">
    //TODO: add warning
    <button type="submit" class="absolute top-44 right-4 button p-4 text-3xl">DELETE</button>
</form>
{#if !loadedForm.isPublished}
    <form action="?/publish" method="post" use:enhance>
        <input type="hidden" value={loadedForm.id} name="formId">
        //TODO: add warning
        <button type="submit" class="absolute top-64 right-4 button p-4 text-3xl">PUBLISZ</button>
    </form>
{:else}
    <span class="text-gray-300 absolute right-4 top-64">Form published</span>
{/if}

<div class="
w-3/5 h-full
bg-linear-to-b from-gray-900 to-gray-800 from-20% to-100%
mx-auto
px-5 py-4 rounded-b-xl
relative
flex flex-col gap-4
">
    {#if loadedForm.isPublished}
        <button type="button" class="button p-1 text-4xl w-fit h-14 fixed top-4 right-[21%]">Usuń</button>
    {/if}
    <input autocomplete="off" bind:value={loadedForm.title} class="input-stealth mx-auto text-2xl" placeholder="title">
    <div class="bg-gray-400 w-3/4 mx-auto h-px"></div>
    <input autocomplete="off" bind:value={loadedForm.description} class="input-stealth mx-auto" placeholder="description">
    <input autocomplete="off" bind:value={loadedForm.slug} class="input-stealth mx-auto" placeholder="slug">
    {#each loadedForm.questions as question, index (question.id)}
        <Question bind:question={loadedForm.questions[index]}
                  deleteMe={() => removeQuestion(loadedForm.questions[index].id)}></Question>
    {/each}
    <button class="button h-15 w-1/4 self-center text-3xl py-2" onclick={() => addQuestion()}>+</button>

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

    .input-radio {
        @apply
        text-gray-300 text-2xl
        rounded-full
        accent-red-300
        ;
    }

    .choice-label {
        @apply
        w-fit
        border-2 border-gray-400 rounded-md p-2 flex flex-row items-center gap-2
        ;
    }

    .input-stealth {
        @apply
        w-fit
        text-gray-300  text-center focus:text-gray-100
        border-0 border-b-2  border-b-transparent focus:border-gray-600
        duration-200
        focus:ring-0 ring-0 active:ring-0
        box-border
        bg-neutral-700/20 focus:bg-neutral-700/40
        ;
        transition-property: border-color, color, padding, background-color;
    }
</style>