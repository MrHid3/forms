<script lang="ts">
	import { Bar, Pie } from 'svelte-chartjs';
	import {
		ArcElement,
		BarElement,
		CategoryScale,
		Chart as ChartJS,
		Legend,
		LinearScale,
		Title,
		Tooltip
	} from 'chart.js';

	ChartJS.register(Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale);

	let { result } = $props();
	// if(result.question.type == "short answer")

	let carousel: HTMLDivElement;

	let data = $state({});

	$effect(() => {
		if (result.question.type == 'single choice' || result.question.type == 'multiple choice') {
			data = {
				labels: result.answers.map(a => a.content),
				datasets: [{
					label: 'Number of votes',
					data: result.answers.map(a => a.count),
					backgroundColor: ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360']
				}]
			};
		}

	});

	let chart = $state('pie');
</script>

<div>
	<p class="text-gray-300 text-2xl text-center">{result.question.content}</p>
	<div class="w-1/3 h-px border border-white mx-auto my-4"></div>

	{#if result.question.type == "short answer" || result.question.type == "long answer"}
		<div class="w-full relative carousel overflow-scroll scroll-smooth" bind:this={carousel}>
			<div class="w-fit flex flex-row gap-2">
				{#each result.answers as answer, index}
					{#if result.question.type == "short answer"}
						<p class="text">{answer}</p>
					{:else}
						<textarea
							class="block text p-4 w-min-50! h-40 wrap-break-word"
						>{answer}</textarea>
					{/if}
				{/each}
			</div>
		</div>
		<div class="flex flex-row gap-4 justify-center">
			<button class="text-gray-300 block z-50 text-4xl"
			        onclick={() => carousel.scrollTo({left: carousel.scrollLeft - carousel.clientWidth/2})}>&lt;
			</button>
			<button class="text-gray-300 block z-50 text-4xl"
			        onclick={() => carousel.scrollTo({left: carousel.scrollLeft + carousel.clientWidth/2})}>&gt;
			</button>
		</div>
	{:else if result.question.type == "range"}
		<div class="flex justify-around">
			<p class="text-gray-300">Min: {result.answers.min}</p>
			<p class="text-gray-300">Max: {result.answers.max}</p>
			<p class="text-gray-300">Average: {result.answers.average}</p>
			<p class="text-gray-300">Median: {result.answers.median}</p>

		</div>
	{:else}
		<div
			class={`flex justify-around items-center flex-1 self-center ${Math.random() < 0.5 ? "flex-row" : "flex-row-reverse"}`}>
			<div class={`
        flex flex-row justify-evenly items-center flex-1
        middle mx-4
        rounded-md
        relative
        z-50
        bg-position-50
        overflow-hidden
        border-2 border-gray-500 hover:border-gray-200 duration-150
        before:bg-linear-to-r before:from-gray-900  before:via-slate-500 before:to-gray-900 before:from-20% before:to-80%
        before:h-100 before:w-[200%]
        before:absolute before:-left-4/5
        before:z-0
        has-[.pie:hover]:before:-left-4/5 has-[.bar:checked]:before:-left-1/5 has-[.bar:hover]:before:-left-1/5
        before:-top-0
        before:duration-500 before:ease-out`}>
				<label for={`chart-${result.question.id}-1`} class="menu-button pie	">
					Pie chart
					<input type="radio" bind:group={chart} value="pie" name={`chart-${result.question.id}`}
					       id={`chart-${result.question.id}-1`} class="hidden" />
					<input type="radio" bind:group={chart} value="pie" class="hidden pie">
				</label>
				<label for={`chart-${result.question.id}-2`} class="menu-button bar">
					Bar chart
					<input type="radio" bind:group={chart} value="bar" name={`chart-${result.question.id}`}
					       id={`chart-${result.question.id}-2`} class="hidden" />
					<input type="radio" bind:group={chart} value="bar" class="hidden bar">
				</label>

			</div>

			<div class="h-100 flex justify-center flex-2">
				{#if chart == "pie"}
					<Pie {data}></Pie>
				{:else}
					<Bar {data}></Bar>
				{/if}
			</div>
		</div>
	{/if}
</div>


<style>
    @import "tailwindcss";

    *:before {
        z-index: -1;
    }

    .menu-button {
        @apply
        text-gray-200 font-bold
        duration-150
        cursor-pointer text-center
        flex-1
        z-50
        flex items-center justify-center
        text-shadow-black/20 text-shadow-sm
        select-none
        w-min
        ;
    }

    .text {
        @apply
        min-h-20
        max-h-40
        px-5 py-2
        relative
        overflow-scroll
        z-10
        duration-150
        text-gray-300 hover:text-gray-200 font-bold text-center
        border-2 border-gray-400 hover:border-gray-300 rounded-xl
        text-shadow-md text-shadow-black/40
        ;
    }
</style>