import type {Actions} from "@sveltejs/kit";
import {PUBLIC_BACKEND_URL} from "$env/static/public";

export const actions: Actions = {
    createForm: async({request, cookies, locals}) => {
        const data = await request.formData();

        const token = cookies.get("token");

        let res = await fetch(`${PUBLIC_BACKEND_URL}/form`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `token=${token}`
            },
            credentials: "include",
            body: JSON.stringify({
                title: data.get("title"),
                description: data.get("description"),
                slug: data.get("slug"),
                requireLogin: data.get("requireLogin") == "on",
                shuffleQuestions: data.get("shuffleQuestions") == "on",
            }),
        });

        return {
            success: res.ok,
            error: (await res.json())
        }
    }
}
