import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { appsettings } from "../../settings/appsettings";
import { FaUserPlus, FaUserEdit, FaUserGraduate, FaEnvelope, FaPhone, FaChalkboardTeacher } from 'react-icons/fa';
import { IoMdCloseCircle } from 'react-icons/io';

const ListarDocente = () => {
    const [docentes, setDocentes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const cargarDocentes = async () => {
            try {
                const response = await fetch(`${appsettings.ApiUrl}Docente/listarDocente`);
                if (!response.ok) {
                    throw new Error('Error al cargar los docentes');
                }
                const data = await response.json();
                setDocentes(data);
                // Activar animación después de cargar datos
                setTimeout(() => setIsVisible(true), 100);
            } catch (err) {
                setError(err.message);
                setTimeout(() => setIsVisible(true), 100);
            } finally {
                setLoading(false);
            }
        };
        cargarDocentes();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
            <div className="animate-pulse flex flex-col items-center">
                <div className="w-16 h-16 border-t-4 border-purple-600 border-solid rounded-full animate-spin"></div>
                <p className="mt-4 text-lg text-purple-800 font-medium">Cargando docentes...</p>
                <div className="flex mt-6 space-x-2">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-3 h-3 bg-indigo-700 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col items-center justify-center p-6">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-red-100 p-8 max-w-lg w-full">
                <div className="p-1 bg-gradient-to-r from-red-500 to-pink-600 rounded-t-xl absolute top-0 left-0 w-full"></div>
                <div className="flex flex-col items-center justify-center text-center">
                    <IoMdCloseCircle className="text-red-600 text-6xl mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Error al cargar los docentes</h3>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button 
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                        onClick={() => window.location.reload()}
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className={`bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen p-6 transition-opacity duration-500 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="max-w-7xl mx-auto">
                <div className={`flex justify-between items-center mb-6 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
                    <h1 className="text-3xl font-bold text-indigo-900 flex items-center">
                        <FaUserGraduate className="mr-3 text-indigo-600" /> 
                        Listado de Docentes
                    </h1>
                    <NavLink 
                        to="/AgregarDocente"
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 px-5 rounded-lg transition duration-300 flex items-center shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                        <FaUserPlus className="mr-2" />
                        Agregar Docente
                    </NavLink>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {docentes.map((docente, index) => (
                        <div 
                            key={docente.idUsuario} 
                            className={`bg-white rounded-xl shadow-xl overflow-hidden border border-purple-100 transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            <div className="p-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    <div className="relative">
                                        {docente.imagen ? (
                                            <img 
                                                src={`${appsettings.ApiUrl.replace('/api', '')}${docente.imagen}`} 
                                                alt={`${docente.nombre} ${docente.apellido}`}
                                                className="h-20 w-20 rounded-full object-cover border-2 border-indigo-200 shadow-md"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://via.placeholder.com/150?text=Error';
                                                }}
                                            />
                                        ) : (
                                            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl border-2 border-indigo-200 shadow-md">
                                                {docente.nombre.charAt(0)}{docente.apellido.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-xl font-semibold text-gray-800">{`${docente.nombre} ${docente.apellido}`}</h3>
                                        <p className="text-indigo-600 flex items-center">
                                            <FaUserGraduate className="mr-1" /> 
                                            {docente.nombreUsuario}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3 mt-4 mb-6">
                                    <div className="flex items-center text-gray-700">
                                        <FaChalkboardTeacher className="text-indigo-500 w-5 h-5 mr-2" />
                                        <span>{docente.rol}</span>
                                    </div>
                                    <div className="flex items-center text-gray-700">
                                        <FaEnvelope className="text-indigo-500 w-5 h-5 mr-2" />
                                        <span className="truncate">{docente.correo}</span>
                                    </div>
                                    <div className="flex items-center text-gray-700">
                                        <FaPhone className="text-indigo-500 w-5 h-5 mr-2" />
                                        <span>{docente.telefono || "No disponible"}</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => navigate(`/EditarDocente/${docente.idUsuario}`)}
                                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105"
                                >
                                    <FaUserEdit className="mr-2" /> 
                                    Editar Docente
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {docentes.length === 0 && !loading && !error && (
                    <div className="bg-white rounded-xl shadow-md p-8 text-center mt-6">
                        <div className="flex flex-col items-center justify-center">
                            <FaUserGraduate className="text-indigo-400 text-5xl mb-4" />
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">No hay docentes registrados</h3>
                            <p className="text-gray-600 mb-6">Agrega un nuevo docente para comenzar</p>
                            <NavLink 
                                to="/AgregarDocente"
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300 flex items-center shadow-md hover:shadow-lg"
                            >
                                <FaUserPlus className="mr-2" />
                                Agregar Docente
                            </NavLink>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListarDocente;