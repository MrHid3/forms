import {PUBLIC_BACKEND_URL} from "$env/static/public";
import type {PageLoad} from "../../../../.svelte-kit/types/src/routes/dashboard/$types";

export const load : PageLoad = async (event) => {

    const form = await event.fetch(`${PUBLIC_BACKEND_URL}/form/${event.params.slug}`, {credentials: "include"});

    if(form.ok){
        return {
            form: (await form.json()).form
        }
    }
}
