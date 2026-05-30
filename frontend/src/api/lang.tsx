import axios from 'axios'

export const apiLang = axios.create({
    baseURL: "/api/lang",
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10_000,
});

apiLang.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
