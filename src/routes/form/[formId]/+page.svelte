<script lang="ts">
	import Form from './Form.svelte';

	const { data, form } = $props();

</script>

<div class="h-min-screen h-full w-3/5 mx-auto container">
	<div class="form-container
				flex flex-row h-fit  z-50 relative
	 			overflow-hidden
        before:bg-linear-to-r before:from-gray-900  before:via-slate-500 before:to-gray-900 before:from-20% before:to-80%
        before:h-100 before:w-[200%]
        before:absolute before:-left-4/5
        before:z-0
        has-[#showForm:hover]:before:-left-4/5! has-[#showResults:checked]:before:-left-1/5 has-[#showResults:hover]:before:-left-1/5
        before:-top-3
        before:duration-500 before:ease-out">
		<label for="showForm" class="menu-button">
			<input type="radio" class="hidden" id="showForm" name="choose" checked>
			<span>Form</span>
		</label>
		<label for="showResults" class="menu-button">
			<input type="radio" class="hidden" id="showResults" name="choose">
			<span>Show results</span>
		</label>
	</div>

	<Form form={data.form}></Form>
</div>

<style>
	@import "tailwindcss";

	.menu-button {
			@apply
			text-4xl text-gray-300 text-center
			w-full
			p-4
			;
	}

	*:before {
			z-index: -1;
	}
</style>