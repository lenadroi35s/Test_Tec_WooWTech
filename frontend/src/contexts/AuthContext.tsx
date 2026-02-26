import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from 'react';
import { User, LoginRequest, RegisterRequest } from '../types';
import { authApi, userApi } from '../services/api';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (data: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            userApi
                .getMe()
                .then(setUser)
                .catch(() => localStorage.removeItem('token'))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (data: LoginRequest): Promise<void> => {
        const res = await authApi.login(data);
        localStorage.setItem('token', res.token);
        setUser(res.user);
    };

    const register = async (data: RegisterRequest): Promise<void> => {
        await authApi.register(data);
    };

    const logout = (): void => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const refreshUser = async (): Promise<void> => {
        const updated = await userApi.getMe();
        setUser(updated);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
    return ctx;
};