import React,{createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const verifyToken = async (token) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/Acceso/Login`, {
               method: 'GET',
               credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(response.status === 401 
                    ? 'Sesión expirada' 
                    : 'Error al verificar token');
            }

            const userData = await response.json();
            localStorage.setItem(import.meta.env.VITE_TOKEN_KEY, userData.token);
            console.log('Respuesta de login',userData);
            setUser({
                id: userData.idUsuario,
                name: userData.nombre,
                lastName: userData.apellido,
                rol: userData.rol,
                email: userData.correo,
                image: userData.ImagenPath
            });
            return userData.rol;
        } catch (error) {
            console.error('Error verificando token:', error);
            localStorage.removeItem(import.meta.env.VITE_TOKEN_KEY);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem(import.meta.env.VITE_TOKEN_KEY);
        if (!token) {
            setLoading(false);
            return;
        }
        verifyToken(token); 
    }, []);

    const login = async (credentials) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/Acceso/Login`, {
                method: 'POST',
                
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error en el login');
            }

            const data = await response.json();
            
            const userData = {
                id: data.idUsuario, // Esto debe ser un número
                name: data.nombreCompleto?.split(' ')[0] || data.nombreUsuario,
                lastName: data.nombreCompleto?.split(' ')[1] || '',
                rol: data.rol,
                email: credentials.correo,
                image: data.imagenUrl,
                username: data.nombreUsuario
            };
            localStorage.setItem(import.meta.env.VITE_TOKEN_KEY, data.token);
            localStorage.setItem('userData', JSON.stringify(userData));
            setUser(userData);
            return userData;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem(import.meta.env.VITE_TOKEN_KEY);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};