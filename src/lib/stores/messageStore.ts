import type { initializeSocketConnection } from "$lib/services/chatService";
import { writable } from "svelte/store";

export interface Message {
    sender: string,
    content: string
}

export interface MessageData {
    messages: Message[],
}

export const messageStore = writable<MessageData>({
    messages: [],
});