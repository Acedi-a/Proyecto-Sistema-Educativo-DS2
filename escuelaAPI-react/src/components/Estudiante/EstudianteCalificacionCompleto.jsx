import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, BookOpen, ArrowDown, ArrowUp, MessageSquare, User, ChevronDown, ChevronRight, Star, AlertCircle, Filter } from 'lucide-react';
import {useAuth} from "../Auth/AuthContext.jsx";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const EstudianteCalificacionCompleto = () => {
    const [calificaciones, setCalificaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtroMateria, setFiltroMateria] = useState('');
    const [busqueda, setBusqueda] = useState('');
    const [ordenacion, setOrdenacion] = useState({ campo: 'fechaRegistro', direccion: 'desc' });
    const [calificacionSeleccionada, setCalificacionSeleccionada] = useState(null);
    const {user} = useAuth();

    useEffect(() => {
        const fetchCalificaciones = async () => {
            try {
                setLoading(true);
                // Suponiendo que la API devuelve todas las calificaciones del estudiante
                const response = await axios.get(`${API_BASE_URL}/Calificacion/${user.id}`);
                setCalificaciones(response.data);
                setError(null);
            } catch (err) {
                setError('Error al cargar los datos de calificaciones');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCalificaciones();
    }, []);

    // Ordenar calificaciones
    const ordenarCalificaciones = (calificaciones) => {
        return [...calificaciones].sort((a, b) => {
            let valorA = a[ordenacion.campo];
            let valorB = b[ordenacion.campo];

            // Convertir fechas a objetos Date para comparar
            if (ordenacion.campo === 'fechaRegistro') {
                valorA = new Date(valorA);
                valorB = new Date(valorB);
            }

            // Si es texto, ignorar mayúsculas/minúsculas
            if (typeof valorA === 'string') {
                valorA = valorA.toLowerCase();
                valorB = valorB.toLowerCase();
            }

            if (ordenacion.direccion === 'asc') {
                return valorA > valorB ? 1 : -1;
            } else {
                return valorA < valorB ? 1 : -1;
            }
        });
    };

    // Filtrar calificaciones
    const filtrarCalificaciones = () => {
        let resultado = [...calificaciones];

        // Filtrar por materia
        if (filtroMateria) {
            resultado = resultado.filter(cal => cal.materia.nombreMateria === filtroMateria);
        }

        // Filtrar por búsqueda
        if (busqueda) {
            const terminoBusqueda = busqueda.toLowerCase();
            resultado = resultado.filter(cal =>
                cal.materia.nombreMateria.toLowerCase().includes(terminoBusqueda) ||
                cal.comentarios.toLowerCase().includes(terminoBusqueda)
            );
        }

        // Ordenar el resultado
        return ordenarCalificaciones(resultado);
    };

    // Obtener lista de materias únicas para el filtro
    const materias = [...new Set(calificaciones.map(cal => cal.materia.nombreMateria))];

    // Cambiar orden
    const cambiarOrden = (campo) => {
        if (ordenacion.campo === campo) {
            setOrdenacion({
                ...ordenacion,
                direccion: ordenacion.direccion === 'asc' ? 'desc' : 'asc'
            });
        } else {
            setOrdenacion({ campo, direccion: 'desc' });
        }
    };

    // Función para formatear fecha completa
    const formatearFechaCompleta = (fechaStr) => {
        const fecha = new Date(fechaStr);
        return fecha.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Función para seleccionar una calificación
    const seleccionarCalificacion = (calificacion) => {
        setCalificacionSeleccionada(calificacion);
    };

    if (loading) {
        return (
            <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-md p-8 animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-6 w-1/3"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="h-12 bg-gray-200 rounded"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-20 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-md p-8 border border-red-200">
                <div className="flex items-center justify-center flex-col text-center">
                    <AlertCircle className="text-red-500 mb-2" size={48} />
                    <h3 className="text-lg font-semibold text-red-500">Error</h3>
                    <p className="text-gray-600">{error}</p>
                    <button
                        className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
                        onClick={() => window.location.reload()}
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    // Función para determinar el color y mensaje según la nota
    const getNotaInfo = (nota) => {
        if (nota >= 90) return { color: 'bg-emerald-500', text: 'Excelente', textColor: 'text-emerald-500', badge: 'bg-emerald-100 text-emerald-800' };
        if (nota >= 80) return { color: 'bg-blue-500', text: 'Muy Bueno', textColor: 'text-blue-500', badge: 'bg-blue-100 text-blue-800' };
        if (nota >= 70) return { color: 'bg-yellow-500', text: 'Bueno', textColor: 'text-yellow-500', badge: 'bg-yellow-100 text-yellow-800' };
        if (nota >= 60) return { color: 'bg-orange-500', text: 'Regular', textColor: 'text-orange-500', badge: 'bg-orange-100 text-orange-800' };
        return { color: 'bg-red-500', text: 'Necesita Mejorar', textColor: 'text-red-500', badge: 'bg-red-100 text-red-800' };
    };

    const calificacionesFiltradas = filtrarCalificaciones();

    return (
        <div className="w-full max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Encabezado */}
                <div className="relative">
                    <div className=" w-full  bg-indigo-500">
                        <div className="p-6 pt-8">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Mis Calificaciones</h2>
                                    <p className="text-white">Historial académico completo</p>
                                </div>
                                <div className="text-center px-4 py-2 bg-indigo-50 rounded-lg">
                                    <div className="text-sm font-medium text-gray-500">Promedio General</div>
                                    <div className="text-xl font-bold text-indigo-600">
                                        {calificaciones.length > 0 ?
                                            (calificaciones.reduce((acc, cal) => acc + cal.nota, 0) / calificaciones.length).toFixed(1) :
                                            "N/A"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Filtros y búsqueda */}
                <div className="px-6 py-4 bg-gray-50 border-y border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Filtro por materia */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Filter size={16} className="text-gray-400" />
                            </div>
                            <select
                                className="block w-full pl-10 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                                value={filtroMateria}
                                onChange={(e) => setFiltroMateria(e.target.value)}
                            >
                                <option value="">Todas las materias</option>
                                {materias.map((materia) => (
                                    <option key={materia} value={materia}>
                                        {materia}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            </div>
                        </div>

                        {/* Buscador */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={16} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar en comentarios o materias..."
                                className="block w-full pl-10 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                        </div>

                        {/* Información de resultados */}
                        <div className="flex items-center justify-end">
                          <span className="text-sm text-gray-500">
                            Mostrando {calificacionesFiltradas.length} de {calificaciones.length} calificaciones
                          </span>
                        </div>
                    </div>
                </div>

                {/* Lista de calificaciones */}
                <div className="p-6">
                    {calificacionesFiltradas.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="text-gray-400 mb-2">
                                <AlertCircle size={40} className="mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-700">No se encontraron calificaciones</h3>
                            <p className="text-gray-500 mt-1">Intenta cambiar los filtros de búsqueda</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => cambiarOrden('materia.nombreMateria')}
                                    >
                                        <div className="flex items-center">
                                            Materia
                                            {ordenacion.campo === 'materia.nombreMateria' && (
                                                ordenacion.direccion === 'asc' ?
                                                    <ArrowUp size={14} className="ml-1" /> :
                                                    <ArrowDown size={14} className="ml-1" />
                                            )}
                                        </div>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => cambiarOrden('nota')}
                                    >
                                        <div className="flex items-center">
                                            Nota
                                            {ordenacion.campo === 'nota' && (
                                                ordenacion.direccion === 'asc' ?
                                                    <ArrowUp size={14} className="ml-1" /> :
                                                    <ArrowDown size={14} className="ml-1" />
                                            )}
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Comentarios
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => cambiarOrden('fechaRegistro')}
                                    >
                                        <div className="flex items-center">
                                            Fecha
                                            {ordenacion.campo === 'fechaRegistro' && (
                                                ordenacion.direccion === 'asc' ?
                                                    <ArrowUp size={14} className="ml-1" /> :
                                                    <ArrowDown size={14} className="ml-1" />
                                            )}
                                        </div>
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 ">
                                {calificacionesFiltradas.map((calificacion) => {
                                    const notaInfo = getNotaInfo(calificacion.nota);
                                    return (
                                        <tr
                                            key={calificacion.idCalificacion}
                                            className={`hover:bg-gray-50 cursor-pointer ${calificacionSeleccionada?.idCalificacion === calificacion.idCalificacion ? 'bg-indigo-50' : ''}`}
                                            onClick={() => seleccionarCalificacion(calificacion)}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center ">
                                                    <BookOpen size={16} className="text-indigo-500 mr-2" />
                                                    <div className="text-md font-medium text-gray-900">{calificacion.materia.nombreMateria}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <span className={`${notaInfo.badge} px-2 py-1 text-md font-medium rounded-full`}>
                                                      {calificacion.nota}
                                                    </span>
                                                    <span className="ml-2 text-md text-gray-500">{notaInfo.text}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-md text-gray-900 max-w-md">
                                                    {calificacion.comentarios || "Sin comentarios"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-md text-gray-500">
                                                {formatearFechaCompleta(calificacion.fechaRegistro)}
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/*
                <div className="p-6 border-t">
                    {calificacionSeleccionada ? (
                        <EstudianteCalificacionDetalle calificacion={calificacionSeleccionada} />
                    ) : (
                        <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="text-gray-400 mb-4">
                                <ChevronDown size={32} className="mx-auto animate-bounce" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-700">Selecciona una calificación</h3>
                            <p className="text-gray-500 mt-2">Haz clic en cualquier fila de la tabla para ver los detalles completos</p>
                        </div>
                    )}
                </div>
                */}

            </div>
        </div>
    );
};