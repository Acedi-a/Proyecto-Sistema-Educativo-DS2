import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Award, BookOpen, Calendar, MessageSquare, User, ChevronRight, Star, AlertCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';


const API_BASE_URL = import.meta.env.VITE_API_URL;


export const EstudianteCalificacionPreview = ({estudianteId}) => {
    const [calificaciones, setCalificaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const coloresMaterias = {
        "Matematica": "bg-blue-500",
        "Lengua y Literatura": "bg-purple-500",
        "Ciencias Naturales": "bg-green-500",
        "Historia": "bg-amber-500",
        "Geografía": "bg-indigo-500",
        "Educación Física": "bg-red-500",
        "Inglés": "bg-teal-500",
        "Arte": "bg-pink-500",
        "Informática": "bg-cyan-500",
        "Filosofía": "bg-violet-500",
        "Economía": "bg-orange-500"
    };

    useEffect(() => {
        const fetchCalificaciones = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/Calificacion/${estudianteId}`);
                setCalificaciones(response.data);
                setError(null);
            } catch (err) {
                setError('Error al cargar las calificaciones');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCalificaciones();
    }, []);

    const formatearFecha = (fechaStr) => {
        const fecha = new Date(fechaStr);
        return fecha.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short'
        });
    };

    const calificacionesRecientes = calificaciones.slice(9, 12);
    console.log(calificaciones.length);

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-50">
                <div className="flex items-center justify-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-50">
                <div className="text-center text-red-500">{error}</div>
            </div>
        );
    }

    if (!calificaciones || calificaciones.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-50">
                <div className="p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 border-b border-indigo-100">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-900">
                        <Award className="text-indigo-600" size={20} />
                        Calificaciones Recientes
                    </h2>
                </div>
                <div className="p-6">
                    <div className="flex flex-col items-center justify-center h-40 text-center">
                        <AlertCircle className="text-indigo-600" size={25} />
                        <p className="text-gray-500 font-medium">No hay calificaciones disponibles</p>
                        <p className="text-sm text-gray-400">Las calificaciones aparecerán aquí cuando estén disponibles</p>
                    </div>
                </div>
            </div>
        );
    }

    // Función para determinar color según la nota
    const getNotaInfo = (nota) => {
        if (nota >= 90) return { textColor: 'text-emerald-600', bgColor: 'bg-emerald-100', text: 'Excelente' };
        if (nota >= 80) return { textColor: 'text-blue-600', bgColor: 'bg-blue-100', text: 'Muy Bueno' };
        if (nota >= 70) return { textColor: 'text-yellow-600', bgColor: 'bg-yellow-100', text: 'Bueno' };
        if (nota >= 60) return { textColor: 'text-orange-600', bgColor: 'bg-orange-100', text: 'Regular' };
        return { textColor: 'text-red-600', bgColor: 'bg-red-100', text: 'Necesita Mejorar' };
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-50 hover:shadow-xl transition-shadow">
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 border-b border-indigo-100">
                <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-900">
                    <Award className="text-indigo-600" size={20} />
                    Calificaciones Recientes
                </h2>
            </div>
            <div className="p-4">
                <div className="space-y-3">
                    {calificacionesRecientes.map((calificacion) => {
                        const notaInfo = getNotaInfo(calificacion.nota);
                        return (
                            <div
                                key={calificacion.idCalificacion}
                                className="rounded-lg p-4 border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all"
                            >
                                <div className="flex items-start">
                                    <div className={`flex-shrink-0 w-2 h-full rounded-full mr-3 ${coloresMaterias[calificacion.materia.nombreMateria] || "bg-gray-400"}`}></div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-semibold text-gray-800">{calificacion.materia.nombreMateria}</h3>
                                            <div className={`${notaInfo.bgColor} ${notaInfo.textColor} font-bold px-2 py-1 rounded text-sm`}>
                                                {calificacion.nota}
                                            </div>
                                        </div>
                                        <div className="mt-1 text-sm text-gray-600 line-clamp-1">
                                            {calificacion.comentarios}
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center text-indigo-600 text-sm font-medium">
                                                <Calendar size={14} className="mr-1" />
                                                <span>{formatearFecha(calificacion.fechaRegistro)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="p-4 pt-0 text-center">
                <NavLink to="/estudiante/calificacion" className="inline-block text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
                    Ver todas las calificaciones
                    <ChevronRight size={14} className="inline ml-1" />
                </NavLink>
            </div>
        </div>
    );
};