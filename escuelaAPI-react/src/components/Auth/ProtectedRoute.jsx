// ProtectedRoute.jsx
/*import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import React from 'react';

const ProtectedRoute = ({ children, roles }) => {
    const { user ,loading} = useAuth();
    if (loading) {
        return <div>Cargando...</div>; // Para evitar redirección prematura
    }
    if (!user) {
        return <Navigate to="/login" replace />; // Redirige si no hay usuario
    }

    if (roles && !roles.includes(user.rol)) {
        return <Navigate to="/dashboard" replace />; // Opcional: manejo de roles no autorizados
    }

    return children;
};
export default ProtectedRoute;*/

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import React from'react';

const ProtectedRoute = ({ roles,error }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Cargando...</div>; // O tu componente de loading
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (roles && !roles.includes(user.rol)) {
        return <Navigate to="/unauthorized" replace />;
    }
    if (error && error.includes('No autorizad')) {
        return <Navigate to="/" />;
    }
    return <Outlet />;
};

export default ProtectedRoute;
