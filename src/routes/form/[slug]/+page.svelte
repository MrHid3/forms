<script lang="ts">

    const { data } = $props();

    console.log(data.form);

    let editMode = $state(false)
</script>

<a href="/dashboard" class="button p-1 absolute top-4 left-4">&#9664; DASHBOARD</a>

<div class="
w-3/5 h-full
bg-linear-to-b from-gray-900 to-gray-800 from-20% to-100%
mx-auto
px-4
relative
">
    <input type="checkbox" class="hidden peer/edit" bind:checked={editMode} id="editModeCheckbox">
    <label for="editModeCheckbox" class="button p-1 text-4xl w-14 h-14 absolute top-4 right-4 peer-checked/edit:rotate-90 hover:rotate-90">&#9998;</label>
    {#if !editMode}
        <p class="text-6xl text-white text-center font-bold pt-5 pb-3">{data.form.title}</p>
        <div class="bg-gray-400 w-3/4 mx-auto h-px"></div>
        <p class="text-gray-500 text-center">{data.form.description}</p>
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
</style>