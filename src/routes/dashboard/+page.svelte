<script lang="ts">

    const {data} = $props();

    let forms = $derived(data.forms.sort((a, b) => a.updatedAt - b.updatedAt));

    console.log(data.forms)
    let rows = [[], [], [], []];
    let i = 0;
    for (const form of forms) {
        rows[i % 4].push(form);
        i++;
    }
</script>

<div class="
w-3/5 h-full
bg-linear-to-b from-gray-900 to-gray-800 from-20% to-100%
mx-auto
px-4
">
    <p class="
	text-gray-200 text-center font-bold text-6xl py-5
	">DASHBOARD</p>
    <div class="
    grid grid-cols-4 gap-4
	">
        {#each rows as row, index(index)}
            <div class="flex flex-col flex-1 gap-4">

                {#each row as form (form.id)}
                    <a href={`/form/${form.id}`} class="
					h-fit min-h-20 w-full
					border-2 border-gray-400 hover:border-gray-200
					rounded-xl
					text-gray-400
					px-5 py-2
					relative
					overflow-hidden
					z-50
					duration-150
					before:w-full before:h-[150%]
					before:bg-linear-to-t before:from-gray-900 before:via-gray-700 before:to-gray-900
					before:absolute before:left-0 before:bottom-0 hover:before:-bottom-1/2
					before:duration-300
					">
                        <p class="text-gray-200 font-bold">{form.title}</p>
                        <p>{form.description}</p>
                    </a>
                {/each}
            </div>

        {/each}
    </div>
</div>

<style>
    @import "tailwindcss";

    .form-property {
        @apply
        font-bold
        text-gray-200;
    }

    *::before{
        z-index: -1;
    }
</style>