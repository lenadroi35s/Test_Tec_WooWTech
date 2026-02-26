import React, { useEffect, useState } from 'react';
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

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const res = await userApi.getAll(page, 10);
                setUsers(res.users);
                setTotalPages(res.totalPages);
                setTotal(res.total);
            } catch {
                setError('Error al cargar usuarios');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [page]);

    const filtered = users.filter(
        (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="page-container">
            <div className="admin-card">

                <div className="admin-header">
                    <div>
                        <h1>Panel de Administración</h1>
                        <p>{total} usuarios registrados</p>
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
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
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
                                    {filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="empty-row">Sin resultados</td>
                                        </tr>
                                    ) : (
                                        filtered.map((u) => (
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