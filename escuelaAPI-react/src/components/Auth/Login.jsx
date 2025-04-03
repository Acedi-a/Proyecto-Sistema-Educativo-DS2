import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import React from 'react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    

    try {
        const userData = await login({ correo: email, clave: password });
        
        // Redirige según el rol
        switch (userData.rol) {
            case 'Estudiante':
                navigate(`/estudiante/${userData.id}`); // Usa el ID del usuario
                break;
            case 'Docente':
                navigate(`/docente/${userData.id}`); //
                break;
            case 'Operador':
                navigate(`/inicioOperador/${userData.id}`);
                break;
            default:
                navigate('/dashboard');
        }
    } catch (err) {
        setError(err.message || 'Error al iniciar sesión');
    }
};

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
                {error && (
                    <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="email">
                            Correo Electrónico
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="w-full px-3 py-2 border rounded"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2" htmlFor="password">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="w-full px-3 py-2 border rounded"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        Ingresar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;