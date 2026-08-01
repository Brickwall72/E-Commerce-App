import axios from 'axios';

// 1. Create a specialized Axios instance pre-pointed to your Docker Express gateway port
export const apiClient = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
    timeout: 10000, // Automates a 10-second timeout safety abort
    headers: {
        'Content-Type': 'application/json',
    }
});

// 2. THE INTERCEPTOR SECURITY GUARD: Automatically injects your session token if it exists
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            // Staples the standard HTTP authorization string onto the network packet headers seamlessly
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
