import {type Actions, redirect} from "@sveltejs/kit";
import {PUBLIC_BACKEND_URL} from "$env/static/public";

export const actions: Actions = {
    publish: async({request, cookies, locals}) => {
        const data = await request.formData();

        const token = cookies.get("token");

        let res = await fetch(`${PUBLIC_BACKEND_URL}/form/${data.get("formId")}/publish`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `token=${token}`
            },
            credentials: "include",
        });
        return {
            success: true
        }
    },
    delete: async({request, cookies, locals}) => {
        const data = await request.formData();

        const token = cookies.get("token");

        let res = await fetch(`${PUBLIC_BACKEND_URL}/form/${data.get("formId")}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `token=${token}`
            },
            credentials: "include",
        });
        if(res.ok){
            redirect(303, "/dashboard")
        }
    }
}