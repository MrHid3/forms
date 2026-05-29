import {PUBLIC_BACKEND_URL} from "$env/static/public";
import type {PageLoad} from "../../../../.svelte-kit/types/src/routes/dashboard/$types";

export const load : PageLoad = async (event) => {

    let formRequest = await event.fetch(`${PUBLIC_BACKEND_URL}/form/${event.params.formId}`, {credentials: "include"});
    let form = await formRequest.json();

    if(formRequest.ok){
        return {
            form: form.form
        }
    }
}
