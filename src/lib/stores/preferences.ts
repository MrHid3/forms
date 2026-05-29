import { writable } from 'svelte/store';

function createPreferencesStore() {
    const { subscribe, set, update } = writable({
        data: [],
        loading: false,
        error: null,
        initialized: false
    });

    return
}