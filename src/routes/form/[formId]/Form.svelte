<script lang="ts">
    import {enhance} from '$app/forms';
    import Question from './Question.svelte';
    import {PUBLIC_BACKEND_URL} from '$env/static/public';
    import {tick, untrack} from 'svelte';
    import {invalidate} from '$app/navigation';
    import {browser} from '$app/environment';

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

    let {form}: { form: Form } = $props();

    let loadedForm = $state(form as Form);

    $effect(() => {
        form;
        untrack(() => {
            loadedForm = form;
            saveForm();
        });
    });

    let oldForm: Form;
    let autoSaveIntervalSeconds: number = $state(5);
    if (browser) {
        autoSaveIntervalSeconds = parseInt(localStorage.getItem('autoSaveIntervalSeconds') ?? '5');
    }

    const saveForm = () => {
        oldForm = structuredClone($state.snapshot(loadedForm));
    };

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
                    diff.questions[i] = found;
                }
            }
        }
        for (let question of form2.questions) {
            if (question.id < 0) {
                diff.questions.push(question);
            }
        }
        return diff;
    };

    const saveChanges = async () => {
        const diff = findDiff(oldForm, loadedForm);

        if (diff.title || diff.description || diff.slug || diff.shuffleQuestions || diff.requireLogin) {
            await fetch(`${PUBLIC_BACKEND_URL}/form/${loadedForm.id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(diff)
            });
        }

        for (let q of diff.questions) {
            if (q.toDelete) {
                await fetch(`${PUBLIC_BACKEND_URL}/question/${q.id}`, {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            } else if (q.id < 0) {
                await fetch(`${PUBLIC_BACKEND_URL}/form/${loadedForm.id}/add-question`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        content: q.content,
                        answers: Array.isArray(q.answers) ? q.answers.map(a => a.content) : q.answers,
                        type: q.type,
                        required: q.required
                    })
                });
            } else {
                await fetch(`${PUBLIC_BACKEND_URL}/question/${q.id}`, {
                    method: 'PUT',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        content: q.content,
                        answers: Array.isArray(q.answers) ? q.answers.map(a => a.content) : q.answers,
                        type: q.type,
                        required: q.required
                    })
                });
            }
        }
        await invalidate(`${PUBLIC_BACKEND_URL}/form/${loadedForm.id}`);
        console.log('form saved');
    };

    const addQuestion = async () => {
        loadedForm.questions.push({
            id: -Math.random() * 103819083498,
            type: 'single choice',
            order: loadedForm.questions.length,
            required: false,
            content: `Question ${loadedForm.questions.length + 1}`,
            answers: [{id: 0, content: 'Option 1'}]
        } as Question);
        await tick();
        const container = document.getElementById('container');
        container.parentElement.scrollTo(0, container.parentElement.scrollHeight);
    };

    const removeQuestion = (id: number) => {
        const index = loadedForm.questions.findIndex(q => q.id == id);
        loadedForm.questions.splice(index, 1);
    };

    saveForm();

    $effect(() => {
        if (loadedForm.questions.length == 0) {
            addQuestion();
        }
    });

    $effect(() => {
        autoSaveIntervalSeconds;
        untrack(() => {
            if (browser)
                localStorage.setItem('autoSaveIntervalSeconds', (autoSaveIntervalSeconds ?? '0').toString());
        });
    });

    let saveInterval: any;
    const restartTimer = () => {
        clearTimeout(saveInterval);
        saveInterval = setTimeout(saveChanges, autoSaveIntervalSeconds * 1000);
    };

    $effect(() => {
        JSON.stringify(loadedForm);
        untrack(() => {
            if (loadedForm.isPublished) return;
            restartTimer();
        });
    });
</script>

<div id="container">
    <div class="flex flex-row sticky top-0 left-0 h-fit justify-evenly bg-gray-900 py-4 border-b-2 border-b-slate-500 opacity-100 z-30">
        <div class="flex flex-col">
            <label class=" text-gray-300 p-1 flex" for="shuffleQuestions">
            <span class="switch">
	<input bind:checked={loadedForm.shuffleQuestions} class="hidden" disabled={loadedForm.isPublished}
           id="shuffleQuestions"
           type="checkbox">
	  </span>
                Shuffle questions
            </label>
            <label class="text-gray-300 p-1 flex" for="requireLogin">
            <span class="switch">
	<input bind:checked={loadedForm.requireLogin} class="hidden" disabled={loadedForm.isPublished}
           id="requireLogin"
           type="checkbox">
	  </span>
                Require login
            </label>
        </div>
        {#if !loadedForm.isPublished}
            <input bind:value={autoSaveIntervalSeconds} class="p-1 top-14 right-4 text-gray-300" type="number">
            <form action="?/delete" method="post" use:enhance>
                <input name="formId" type="hidden" value={loadedForm.id}>
                <!--	TODO: add warning-->
                <button class="button p-4 text-3xl" type="submit">DELETE</button>
            </form>
            <form action="?/publish" method="post" use:enhance>
                <input type="hidden" value={loadedForm.id} name="formId">
                <!--		TODO: add warning-->
                <button type="submit" class="button p-4 text-3xl">PUBLISZ</button>
            </form>
        {:else}
            <span class="text-gray-300 right-4 top-64">Form published</span>
        {/if}

    </div>
    <div class="flex flex-col">
        <input autocomplete="off" bind:value={loadedForm.title} class="input-stealth mx-auto text-2xl"
               disabled={loadedForm.isPublished}
               placeholder="title">
        <div class="bg-gray-400 w-3/4 mx-auto h-px"></div>
        <input autocomplete="off" bind:value={loadedForm.description} class="input-stealth mx-auto"
               disabled={loadedForm.isPublished}
               placeholder="description">
        <input autocomplete="off" bind:value={loadedForm.slug} class="input-stealth mx-auto"
               disabled={loadedForm.isPublished}
               placeholder="slug">

    </div>
    {#each loadedForm.questions as question, index (question.id)}
        <Question bind:question={loadedForm.questions[index]}
                  deleteMe={() => removeQuestion(loadedForm.questions[index].id)}
                  published={loadedForm.isPublished}></Question>
    {/each}
    {#if !loadedForm.isPublished}
        <button class="button h-15 w-1/4 self-center text-3xl py-2" onclick={() => addQuestion()}>+</button>
    {/if}
</div>

<style>
    @import "tailwindcss";

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
</style>