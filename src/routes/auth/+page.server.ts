import type {Actions} from "@sveltejs/kit";

export const actions: Actions = {
    register: async ({request, cookies, locals}) => {
        const data = request.formData();

        const res = await fetch("/api/register", {
            method: "POST",
            body: JSON.stringify({
                email: data.get("email"),
                password: data.get("password")
            })
        })
    }
}