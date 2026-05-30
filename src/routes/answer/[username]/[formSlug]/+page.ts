import type {PageLoad} from "../../../../../.svelte-kit/types/src/routes/dashboard/$types";
import {PUBLIC_BACKEND_URL} from "$env/static/public";

export const load : PageLoad = async (event) => {

    let formRequest = await event.fetch(`${PUBLIC_BACKEND_URL}/form/${event.params.username}/${event.params.formSlug}`, {credentials: "include"});
    // console.log(formRequest);
    let form = await formRequest.json();

    // if(formRequest.ok){
        return {
						error: form.status == "error" ? form.message : null,
            form: form.form,
						url: `${event.params.username}/${event.params.formSlug}`
        }
    // }
}
