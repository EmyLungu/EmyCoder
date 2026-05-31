import axios from 'axios'

export const apiRun = axios.create({
    baseURL: "/api/run",
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 16_000,
});

apiRun.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
