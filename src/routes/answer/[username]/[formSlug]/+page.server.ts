import { type Actions } from '@sveltejs/kit';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

const toNumber = (str) => {
	return Number.isNaN(parseInt(str)) ? str : parseInt(str);
}

export const actions: Actions = {
	send: async ({ request, cookies, locals }) => {
		const data = await request.formData();

		const token = cookies.get('token');
		const formId = data.get("formId")
		data.delete("formId")
		let body = {};
		for(let entry of data.entries()){
			if(body[entry[0]]){
				body[entry[0]] = Array.isArray(body[entry[0]]) ? [...body[entry[0]], toNumber(entry[1])] : [body[entry[0]], toNumber(entry[1])]
			}else{
				body[entry[0]] = toNumber(entry[1])
			}
		}

		let res = await fetch(`${PUBLIC_BACKEND_URL}/form/${formId}/send-answer`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Cookie: `token=${token}`
			},
			credentials: 'include',
			body: JSON.stringify(body)
		});

		if(res.ok)
			return {
				success: true
			};
		else
			return {
				success: false
			}
	}
};
