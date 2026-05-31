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
	console.log(result);

	let carousel: HTMLDivElement;

	let data = $state({});

	if (result.question.type == 'single choice' || result.question.type == 'multiple choice') {
		data = {
			labels: result.answers.map(a => a.content),
			datasets: [{
				label: "Number of votes",
				data: result.answers.map(a => a.count),
				backgroundColor: ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360']
			}]
		};
	}

	let chart = $state('pie');
</script>

<div>
	<p class="text-gray-300">{result.question.content}</p>

	{#if result.question.type == "short answer" || result.question.type == "long answer"}
		<div class="w-full relative carousel overflow-scroll scroll-smooth" bind:this={carousel}>
			<div class="w-fit flex flex-row gap-2">
				{#each result.answers as answer, index}
					{#if result.question.type == "short answer"}
						<p class="p-4 w-fit bg-neutral-600 border-2 border-neutral-500 rounded-xl">{answer}</p>
					{:else}
						<textarea
							class="p-4 w-min-50! w-max-200! bg-neutral-600 border-2 border-neutral-500 rounded-xl h-40 "
							disabled>{answer}</textarea>
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
		<p class="text-gray-300">Min: {result.answers.min}</p>
		<p class="text-gray-300">Max: {result.answers.max}</p>
		<p class="text-gray-300">Average: {result.answers.average}</p>
		<p class="text-gray-300">Median: {result.answers.median}</p>
	{:else}
		<div class={`flex justify-around items-center flex-1 self-center ${Math.random() < 0.5 ? "flex-row" : "flex-row-reverse"}`}>
			<div class="rounded-xltext-gray-300">
				<label for="{`chart-${result.question.id}-1`}" class="p-4 bg-neutral-600 has-checked:bg-neutral-400 duration-200">
					Pie chart
					<input type="radio" bind:group={chart} value="pie" name={`chart-${result.question.id}`} id={`chart-${result.question.id}-1`} class="hidden"/>
				</label>
				<label for="{`chart-${result.question.id}-2`}" class="p-4 bg-neutral-600 has-checked:bg-neutral-400 duration-200">
					Bar chart
					<input type="radio" bind:group={chart} value="bar" name={`chart-${result.question.id}`} id={`chart-${result.question.id}-2`} class="hidden"/>
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
</style>