import type { initializeSocketConnection } from "$lib/services/chatService";
import { writable } from "svelte/store";

export interface ConnectionData {
    connection: ReturnType<typeof initializeSocketConnection> | null
}

export const chatStore = writable<ConnectionData>({
    connection: null
});