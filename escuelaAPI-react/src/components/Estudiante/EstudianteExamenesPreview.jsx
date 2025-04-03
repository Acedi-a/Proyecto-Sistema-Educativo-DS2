// src/components/estudiante/EstudianteExamenesPreview.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { ClipboardList, ChevronRight, AlertCircle, Loader, User } from 'lucide-react';
import { useAuth } from '../Auth/AuthContext';

const API_BASE_URL = 'https://localhost:7279/api'; // Reemplaza con tu URL base real

// Función para formatear fechas y calcular color basado en días restantes
const formatExamenFecha = (fechaISO) => {
    if (!fechaISO) return { fecha: 'N/A', dia: '?', mes: '?', color: 'bg-gray-400' };
    try {
        const fecha = new Date(fechaISO);
        const dia = fecha.getDate();
        const mes = fecha.toLocaleDateString('es-ES', { month: 'short' }).replace('.', ''); // 'abr'
        return {
            fecha: fecha.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }), // Ej: martes, 1 de abril de 2025
            dia: dia,
            mes: mes.toUpperCase(),
        };
    } catch (error) {
        console.error("Error formateando fecha examen:", error);
        return { fecha: 'Inválida', dia: 'X', mes: 'ERR', color: 'bg-red-500' };
    }
};

const getColorPorDias = (diasRestantes) => {
    if (diasRestantes < 0) return 'bg-gray-500'; // Pasado
    if (diasRestantes <= 2) return 'bg-red-500'; // Muy pronto
    if (diasRestantes <= 7) return 'bg-amber-500'; // Próxima semana
    return 'bg-blue-500'; // Más adelante
};


export const EstudianteExamenesPreview = ({ estudianteId }) => {
    const [examenes, setExamenes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const { user  } = useAuth();


    useEffect(() => {
        if (!user.id) {
            setLoading(false);
            setError("ID de estudiante no proporcionado.");
            return;
        }

        const fetchExamenes = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${API_BASE_URL}/Examen/academico/examenes/${user.id}`);
                const proximosExamenes = response.data
                    .filter(ex => ex.diasRestantes >= 0)
                    .sort((a, b) => a.diasRestantes - b.diasRestantes)
                    .slice(0, 3);
                setExamenes(proximosExamenes);
            } catch (err) {
                console.error("Error fetching exámenes:", err);
                setError("No se pudieron cargar los exámenes.");
            } finally {
                setLoading(false);
            }
        };

        fetchExamenes();
    }, [user.id]);

    return (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-indigo-50 hover:shadow-xl transition-shadow">
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 border-b border-indigo-100">
                <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-900">
                    <ClipboardList className="text-indigo-600" size={20} />
                    Próximos Exámenes
                </h2>
            </div>
            <div className="p-6 min-h-[200px]">
                {loading && (
                    <div className="flex justify-center items-center h-full">
                        <Loader className="animate-spin text-indigo-600" size={32} />
                    </div>
                )}
                {error && !loading && (
                    <div className="flex flex-col items-center justify-center text-center text-red-600">
                        <AlertCircle size={30} className="mb-2"/>
                        <p className="font-medium">Error</p>
                        <p className="text-sm text-red-500">{error}</p>
                    </div>
                )}
                {!loading && !error && examenes.length === 0 && (
                    <p className="text-center text-gray-500">No hay exámenes próximos registrados.</p>
                )}
                {!loading && !error && examenes.length > 0 && (
                    <div className="space-y-4">
                        {examenes.map((examen, index) => {
                            const { dia, mes } = formatExamenFecha(examen.fechaExamen);
                            const color = getColorPorDias(examen.diasRestantes);
                            return (
                                <div key={index} className="flex items-center p-1 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                                    <div className={`${color} p-3 flex flex-col items-center justify-center text-white w-16 rounded-l-lg`}>
                                        <div className="text-xs font-medium">{mes}</div>
                                        <div className="text-2xl font-bold">{dia}</div>
                                    </div>
                                    <div className="p-3 flex-1">
                                        <h4 className="font-semibold text-gray-800">{examen.nombreMateria}</h4>
                                        <div className="flex items-center text-sm text-gray-600 mt-1 gap-2 flex-wrap">
                                            <span className="bg-gray-100 px-2 py-1 rounded-md text-xs">{examen.horaInicio} - {examen.horaFin}</span>
                                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${examen.diasRestantes <= 2 ? 'text-red-700 bg-red-100' : 'text-gray-700 bg-gray-100'}`}>
                                                {examen.diasRestantes === 0 ? '¡Hoy!' : examen.diasRestantes === 1 ? 'Mañana' : `En ${examen.diasRestantes} días`}
                                             </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                {!loading && (
                    <NavLink
                        to="/estudiante/examen"
                        className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center w-full justify-center transition-colors"
                    >
                        Ver calendario completo <ChevronRight size={16} className="ml-1" />
                    </NavLink>
                )}
            </div>
        </div>
    );
};