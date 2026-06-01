import { apiChat } from './chat';
import type { ChatRequest } from './types';

export const chatService = {
    sendChat: async (payload: ChatRequest): Promise<Response> => {
        const baseURL = apiChat.defaults.baseURL || '';
        const url = `${baseURL}/chat`;

        const headers = new Headers({
            'Content-Type': 'application/json',
        });

        const token = localStorage.getItem('auth_token');
        if (token) {
            headers.append('Authorization', `Bearer ${token}`);
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload),
        });

        return response;
    },
};
