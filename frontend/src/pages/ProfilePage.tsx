import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userApi } from '../services/api';
import { AxiosError } from 'axios';
import { ApiError } from '../types';

const ProfilePage = () => {
    const { user, logout, refreshUser } = useAuth();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSave = async () => {
        if (!name.trim() || name.trim().length < 2) {
            setError('El nombre debe tener al menos 2 caracteres');
            return;
        }
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await userApi.updateMe({ name: name.trim() });
            await refreshUser();
            setSuccess('Perfil actualizado correctamente');
            setEditMode(false);
        } catch (err) {
            const axiosErr = err as AxiosError<ApiError>;
            setError(axiosErr.response?.data?.message || 'Error al actualizar');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setName(user?.name || '');
        setEditMode(false);
        setError('');
        setSuccess('');
    };

    if (!user) return null;

    return (
        <div className="page-container">
            <div className="profile-card">

                <div className="profile-header">
                    <div className="avatar">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="profile-name">{user.name}</h1>
                        <span className={`badge badge-${user.role}`}>{user.role}</span>
                    </div>
                </div>

                <div className="profile-body">
                    <div className="field-group">
                        <label>Nombre</label>
                        {editMode ? (
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => { setName(e.target.value); setError(''); }}
                                className="input-inline"
                                autoFocus
                            />
                        ) : (
                            <span>{user.name}</span>
                        )}
                    </div>

                    <div className="field-group">
                        <label>Email</label>
                        <span>{user.email}</span>
                    </div>

                    <div className="field-group">
                        <label>Rol</label>
                        <span style={{ textTransform: 'capitalize' }}>{user.role}</span>
                    </div>

                    <div className="field-group">
                        <label>Miembro desde</label>
                        <span>
                            {new Date(user.created_at).toLocaleDateString('es-CO', {
                                year: 'numeric', month: 'long', day: 'numeric',
                            })}
                        </span>
                    </div>

                    {error && <div className="alert alert-error">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}

                    <div className="profile-actions">
                        {editMode ? (
                            <>
                                <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
                                    {loading ? 'Guardando...' : 'Guardar'}
                                </button>
                                <button className="btn btn-secondary" onClick={handleCancel}>
                                    Cancelar
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="btn btn-primary" onClick={() => setEditMode(true)}>
                                    Editar perfil
                                </button>
                                {user.role === 'admin' && (
                                    <button className="btn btn-secondary" onClick={() => navigate('/admin')}>
                                        Panel Admin
                                    </button>
                                )}
                                <button className="btn btn-danger" onClick={handleLogout}>
                                    Cerrar sesión
                                </button>
                            </>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProfilePage;