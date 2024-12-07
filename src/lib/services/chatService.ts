
import io from 'socket.io-client';
import { messageStore, type MessageData } from '$lib/stores/messageStore';
import { userStore } from '$lib/stores/userStore';
import { CONFIG } from '../../config';



function isValidMessageHistory(response_json: any): response_json is  MessageData {
    return response_json !== null && typeof response_json === 'object' && "messages" in response_json;
}
export async function loadMessageHistory(): Promise<void> {
    const response = await fetch(CONFIG.getApiUrl('chat/get_history'));

    if (!response.ok) {
        console.error("Response not ok when loading chat history: ", response.status);
        return;
    }

    try {
        const responseJson: { messages: { username: string; message: string }[] } = await response.json();
        console.log("Original response:", responseJson);

        const transformedMessages: Message[] = responseJson.messages.map(item => ({
            sender: item.username,
            content: item.message,
        }));

        console.log("Transformed messages:", transformedMessages);

        messageStore.set({ messages: transformedMessages });
    } catch (error) {
        console.error("Error parsing JSON or processing messages:", error);
    }
}
export function initializeSocketConnection(accessToken: string) {
    const socket = io(CONFIG.getApiUrl('chat'), {
        transports: ['websocket'],
        extraHeaders: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    socket.on('connect', () => {
        console.log('Socket connected successfully');
    });

    socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
    });

    socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
    });

    socket.on('connect', () => {
        console.log('Attempting to authenticate');
        socket.emit('authenticate', { token: accessToken }, (response: any) => {
            console.log('Authentication response:', response);
        });
    });

    socket.on('message_history', (data: { messages: { username: string, message: string }[] }) => {
        messageStore.update(store => ({
            messages: data.messages.map(msg => ({
                sender: msg.username,
                content: msg.message
            }))
        }));
    });

    socket.on('receive_message', (data: { username: string, message: string }) => {
        messageStore.update(store => ({
            messages: [ {
                sender: data.username,
                content: data.message
            },
            ...store.messages,]
        }));
    });
    
    function sendMessage(message: string) {
        console.log('Attempting to send message:', message);
        socket.emit('send_message', {
          token: accessToken,
          message: message
        }, (response: any) => {
            console.log('Message send response:', response);
        });
    }

    socket.on('auth_error', (error) => {
        console.error('Socket Authentication Error:', error);
        messageStore.set({ messages: [] });
    });

    return {
        sendMessage,
        disconnect: () => socket.disconnect()
    };
}