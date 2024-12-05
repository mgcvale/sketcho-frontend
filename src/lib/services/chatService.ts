
import io from 'socket.io-client';
import { messageStore } from '$lib/stores/messageStore';
import { userStore } from '$lib/stores/userStore';
import { CONFIG } from '../../config';

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