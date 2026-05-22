import type {Actions} from "@sveltejs/kit";
import {PUBLIC_BACKEND_URL} from "$env/static/public";

export const actions: Actions = {
    addQuestion: async({request, cookies, locals}) => {
        const data = await request.formData();
        const questionType = data.get("questionType");
        let answers;

        if(questionType == "range"){
            answers = [
                {min: data.get("min")},
                {max: data.get("max")},
                {step: data.get("step")}
            ]
        } else if (questionType == "single choice" || questionType == "multiple choice"){
            answers = data.getAll("answers");
        } else{
            answers = null;
        }

        const token = cookies.get("token");

        console.log({
        answers: answers,
            content: data.get("content"),
            type: questionType,
            required: data.get("required") ?? false
    })
        let res = await fetch(`${PUBLIC_BACKEND_URL}/form/${data.get("formId")}/add-question`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `token=${token}`
            },
            credentials: "include",
            body: JSON.stringify({
                answers: answers,
                content: data.get("content"),
                type: questionType,
                required: data.get("required") ?? false
            }),
        });
        console.log(await res.json())
        return {
            success: true
        }
    }
}