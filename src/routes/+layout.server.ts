import type {PageLoad} from "../../.svelte-kit/types/src/routes/dashboard/$types";
import {PUBLIC_BACKEND_URL} from "$env/static/public";

export const load: PageLoad = async ({cookies}) => {

    const token = cookies.get('token');

    let activeToken = null;
    if (token) {
        const user = parseJwt(token);
        if (user && user.exp * 1000 > Date.now()) {
            activeToken = token;
        }
    }

    return {
        loggedIn: !!activeToken,
    }
}
function parseJwt(token: string) {
    try {
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'));
    } catch {
        return null;
    }
}

