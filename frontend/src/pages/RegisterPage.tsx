import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AxiosError } from 'axios';
import { ApiError } from '../types';

const RegisterPage = () => {
    const { register, login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const validate = (): string => {
        if (!form.name || form.name.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
        if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Email inválido';
        if (form.password.length < 8) return 'La contraseña debe tener mínimo 8 caracteres';
        if (form.password !== form.confirmPassword) return 'Las contraseñas no coinciden';
        return '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationError = validate();
        if (validationError) { setError(validationError); return; }

        setLoading(true);
        try {
            await register({ name: form.name, email: form.email, password: form.password });
            await login({ email: form.email, password: form.password });
            navigate('/profile');
        } catch (err) {
            const axiosErr = err as AxiosError<ApiError>;
            setError(axiosErr.response?.data?.message || 'Error al registrarse');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">Crear Cuenta</h1>
                <p className="auth-subtitle">Únete a Nosotros</p>

                <form onSubmit={handleSubmit} className="auth-form" noValidate>
                    <div className="form-group">
                        <label htmlFor="name">Nombre</label>
                        <input
                            id="name" name="name" type="text"
                            value={form.name} onChange={handleChange}
                            placeholder="Tu nombre completo"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email" name="email" type="email"
                            value={form.email} onChange={handleChange}
                            placeholder="example@email.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            id="password" name="password" type="password"
                            value={form.password} onChange={handleChange}
                            placeholder="Mínimo 8 caracteres"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmar contraseña</label>
                        <input
                            id="confirmPassword" name="confirmPassword" type="password"
                            value={form.confirmPassword} onChange={handleChange}
                            placeholder="Repite tu contraseña"
                        />
                    </div>

                    {error && <div className="alert alert-error">{error}</div>}

                    <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                        {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                    </button>
                </form>

                <p className="auth-link">
                    ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;