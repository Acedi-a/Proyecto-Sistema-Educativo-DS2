import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';

const ListarDocentesPorEstudiante = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [docentes, setDocentes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchDocentes = async () => {
            try {
                const token = localStorage.getItem(import.meta.env.VITE_TOKEN_KEY) || user.token;
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:7279';
                const url = `${apiUrl}/Mensaje/listarDocentesSegunEstudiantes/${user.id}`;

                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || 'Error al obtener docentes');
                }

                const data = await response.json();

                const docentesNormalizados = Array.isArray(data)
                    ? data.map(d => ({
                        id: d.idUsuario || d.id,
                        nombre: d.nombre || 'Nombre no disponible',
                        apellido: d.apellido || 'Apellido no disponible'
                    }))
                    : [];

                setDocentes(docentesNormalizados);

            } catch (err) {
                console.error('[DEBUG] Error en fetchDocentes:', err);
                setError(err.message);
            } finally {
                setCargando(false);
            }
        };

        fetchDocentes();
    }, [user.id, navigate]);

    const filteredDocentes = docentes.filter(docente =>
        `${docente.nombre} ${docente.apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderEstadoContent = () => {
        if (cargando) {
            return (
                <div className="flex justify-center items-center p-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    <span className="ml-3 text-lg text-gray-700">Cargando docentes...</span>
                </div>
            );
        }

        if (error) {
            return (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4 rounded">
                    <div className="flex">
                        <div className="py-1">
                            <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-bold">Error</p>
                            <p>{error}</p>
                        </div>
                    </div>
                </div>
            );
        }

        if (filteredDocentes.length === 0) {
            return (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 my-4 rounded">
                    <div className="flex">
                        <div className="py-1">
                            <svg className="h-6 w-6 text-yellow-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-bold">Sin resultados</p>
                            <p>No se encontraron docentes que coincidan con tu búsqueda.</p>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocentes.map((docente, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className="bg-blue-100 rounded-full p-3 mr-4">
                                    <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">
                                        {docente.nombre} {docente.apellido}
                                    </h2>
                                    <p className="text-gray-500 text-sm">Docente</p>
                                </div>
                            </div>

                            <div className="mt-4 flex justify-between">
                                <button
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 flex items-center"
                                    onClick={() => navigate(`/estudiante/docente/${user.id}/${docente.id}`)}
                                >
                                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    Ver detalles
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl shadow-lg mb-8 p-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <h1 className="text-3xl font-bold text-white">Mis Docentes</h1>
                            <p className="text-blue-100 mt-1">
                                Encuentra y comunícate con tus profesores
                            </p>
                        </div>
                        <button
                            className="bg-white text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded-lg shadow transition-colors duration-300 flex items-center"
                            onClick={() => navigate(`/estudiante/historial/mensaje/${user.id}`)}
                        >
                            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            Historial de mensajes
                        </button>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar docente por nombre..."
                            className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {renderEstadoContent()}
            </div>
        </div>
    );
};

export default ListarDocentesPorEstudiante;