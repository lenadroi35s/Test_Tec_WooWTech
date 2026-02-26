import axios, { AxiosError } from 'axios';
import { AuthResponse, LoginRequest, RegisterRequest, User, ApiError } from '../types';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiError>) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export const authApi = {
    login: (data: LoginRequest) =>
        api.post<AuthResponse>('/auth/login', data).then((res) => res.data),

    register: (data: RegisterRequest) =>
        api.post<{ message: string }>('/auth/register', data).then((res) => res.data),
};

export const userApi = {
    getMe: () =>
        api.get<User>('/users/me').then((res) => res.data),

    updateMe: (data: { name: string }) =>
        api.put<{ message: string; user: User }>('/users/me', data).then((res) => res.data),

    getAll: (page = 1, limit = 20) =>
        api
            .get<{ users: User[]; total: number; page: number; totalPages: number }>(
                `/users?page=${page}&limit=${limit}`
            )
            .then((res) => res.data),
};

export default api;