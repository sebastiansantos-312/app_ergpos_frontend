import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request interceptor - Add auth token and log requests in dev
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log requests in development
        if (import.meta.env.DEV) {
            console.log(`🔵 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
                params: config.params,
                data: config.data,
            });
        }

        return config;
    },
    (error) => {
        if (import.meta.env.DEV) {
            console.error('🔴 Request Error:', error);
        }
        return Promise.reject(error);
    }
);

// Response interceptor - Handle auth errors and log responses in dev
api.interceptors.response.use(
    (response) => {
        // Log successful responses in development
        if (import.meta.env.DEV) {
            console.log(`🟢 API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
                status: response.status,
                data: response.data,
            });
        }
        return response;
    },
    (error) => {
        // Log errors in development
        if (import.meta.env.DEV) {
            console.error(`🔴 API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            });
        }

        // Handle 401 Unauthorized - Clear auth and redirect to login
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default api;