import { type Actions, redirect } from '@sveltejs/kit';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

export const actions: Actions = {
	register: async ({ request }) => {
		const data = await request.formData();

		const res = await fetch(`${PUBLIC_BACKEND_URL}/register`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				username: data.get('username'),
				password: data.get('password')
			})
		});

		return {
			type: "register",
			res: (await res.json())
		}
	},

	login: async ({ request, cookies }) => {
		const data = await request.formData();

		const res = await fetch(`${PUBLIC_BACKEND_URL}/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				username: data.get('username'),
				password: data.get('password')
			})
		});

		let token;
		let doRedirect = false;
		try{
			token = res.headers.getSetCookie()[0];
			token = token.substring(6, token.indexOf(";"))
			cookies.set('token', token, {
				httpOnly: true,
				secure: false,
				sameSite: "strict",
				path: "/",
				maxAge: 60 * 60 * 24 * 30
			})
			doRedirect = true;
		}catch(e){
			console.log(e)
		}

		if(doRedirect){
			redirect(303, "/dashboard")
		}

		return {
			type: "login",
			res: (await res.json())
		}
	}
};
