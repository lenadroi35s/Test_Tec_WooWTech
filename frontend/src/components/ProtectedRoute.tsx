import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

interface Props {
    children: React.ReactNode;
    requiredRole?: UserRole;
}

const ProtectedRoute = ({ children, requiredRole }: Props) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner" />
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;

    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/profile" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;