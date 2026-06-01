import axios from 'axios'

export const apiChat = axios.create({
    baseURL: "/api/assistant",
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 16_000,
});

apiChat.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
