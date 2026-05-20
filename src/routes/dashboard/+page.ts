import type {PageLoad} from "../../../.svelte-kit/types/src/routes/dashboard/$types";
import {PUBLIC_BACKEND_URL} from "$env/static/public";


export const load : PageLoad = async (event) => {

    const forms = await event.fetch(`${PUBLIC_BACKEND_URL}/forms`, {credentials: "include"});

    if(forms.ok){
        return {
            forms: (await forms.json()).forms
        }
    }
}