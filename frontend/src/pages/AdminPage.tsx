import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../services/api';
import { User } from '../types';

const AdminPage = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await userApi.getAll(page, 10, search);
            setUsers(res.users);
            setTotalPages(res.totalPages);
            setTotal(res.total);
        } catch {
            setError('Error al cargar usuarios');
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchInput);
            setPage(1);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchInput]);

    return (
        <div className="page-container">
            <div className="admin-card">

                <div className="admin-header">
                    <div>
                        <h1>Panel de Administración</h1>
                        <p>{total} usuarios encontrados</p>
                    </div>
                    <button className="btn btn-secondary" onClick={() => navigate('/profile')}>
                        ← Mi perfil
                    </button>
                </div>

                <div className="admin-body">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Buscar por nombre o email..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />

                    {error && <div className="alert alert-error">{error}</div>}

                    {loading ? (
                        <div className="loading-row"><div className="spinner" /></div>
                    ) : (
                        <div className="table-wrapper">
                            <table className="users-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>Email</th>
                                        <th>Rol</th>
                                        <th>Registro</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="empty-row">
                                                {search ? `Sin resultados para "${search}"` : 'No hay usuarios'}
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map((u) => (
                                            <tr key={u.id}>
                                                <td>#{u.id}</td>
                                                <td>{u.name}</td>
                                                <td>{u.email}</td>
                                                <td>
                                                    <span className={`badge badge-${u.role}`}>{u.role}</span>
                                                </td>
                                                <td>
                                                    {new Date(u.created_at).toLocaleDateString('es-CO')}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className="btn btn-secondary"
                                disabled={page === 1}
                                onClick={() => setPage((p) => p - 1)}
                            >
                                ← Anterior
                            </button>
                            <span>Página {page} de {totalPages}</span>
                            <button
                                className="btn btn-secondary"
                                disabled={page === totalPages}
                                onClick={() => setPage((p) => p + 1)}
                            >
                                Siguiente →
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AdminPage;