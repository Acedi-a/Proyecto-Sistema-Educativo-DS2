import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    CalendarDays, BookOpen, CreditCard, ClipboardList,
    Bell, ChevronRight, UserCircle, BarChart3, Award, Lightbulb, BookMarked,
    Loader, AlertCircle
} from "lucide-react";

import { NotificacionesToast } from './EstudianteNotificacionesToast.jsx';

import { EstudiantePagosPreview } from './EstudiantePagosPreview.jsx';
import { EstudianteExamenesPreview } from './EstudianteExamenesPreview.jsx';
import { EstudianteHorarioDiario } from "./EstudianteHorarioDiario.jsx";
import { EstudianteCalificacionPreview } from "./EstudianteCalificacionPreview.jsx";
import { EstudianteAsistenciaPreview } from "./EstudianteAsistenciasPreview.jsx";
import {useAuth} from "../Auth/AuthContext";
import {EstudiantePerfil} from "./EstudiantePerfil.jsx";

const API_BASE_URL = import.meta.env.VITE_API_URL;


const progresoSemestral = 68;


export const EstudianteView = () => {


    const [estudiante, setEstudiante] = useState(null);
    const [loadingEstudiante, setLoadingEstudiante] = useState(true);
    const [errorEstudiante, setErrorEstudiante] = useState(null);
    const { user } = useAuth();
    console.log(user)


    useEffect(() => {
        if (!user.id) {
            setErrorEstudiante("No se pudo identificar al estudiante.");
            setLoadingEstudiante(false);
            return;
        }

        const fetchEstudianteData = async () => {
            setLoadingEstudiante(true);
            setErrorEstudiante(null);
            setEstudiante(null);
            try {
                const response = await axios.get(`${API_BASE_URL}/Estudiante/ObtenerE/${user.id}`);
                setEstudiante(response.data.estudiante || response.data);
            } catch (err) {
                console.error("Error fetching estudiante data:", err);
                setErrorEstudiante("No se pudieron cargar los datos del estudiante. Intenta recargar la página.");
            } finally {
                setLoadingEstudiante(false);
            }
        };

        fetchEstudianteData();

    }, [user.id]);

    if (errorEstudiante) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center p-4">
                <div className="text-center text-red-600 bg-white p-8 rounded-xl shadow-lg border border-red-100 max-w-md w-full">
                    <AlertCircle size={48} className="mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Error al cargar</h1>
                    <p className="text-gray-700">{errorEstudiante}</p>
                </div>
            </div>
        );
    }

    if (loadingEstudiante || !estudiante) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <Loader className="animate-spin text-indigo-600" size={64} />
            </div>
        );
    }

    return (
        <div className="max-w-7xl m-auto bg-gradient-to-br from-slate-50 to-blue-50">



            <EstudiantePerfil estudiante={estudiante}>
                <NotificacionesToast estudianteId={user.id} apiBaseUrl={API_BASE_URL} />

            </EstudiantePerfil>

            {/* Indicador de progreso semestral */}
            <div className="container mx-auto px-4 -mt-6 relative z-10">
                <div className="bg-white rounded-xl shadow-xl p-6 mb-6 border border-indigo-100">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-100 rounded-lg">
                                <BarChart3 className="text-indigo-600" size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Progreso Semestral</h3>
                                <p className="text-gray-500 text-sm">Curso: {estudiante?.curso?.nombreCurso || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 bg-gray-200 rounded-full h-4 overflow-hidden"> {/* Añadido overflow-hidden */}
                            <div className="h-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-width duration-500 ease-out" style={{ width: `${progresoSemestral}%` }}></div>
                        </div>
                        <div className="text-center">
                            <span className="text-xl font-bold text-indigo-700">{progresoSemestral}%</span>
                            <p className="text-xs text-gray-500">Completado</p>
                        </div>
                    </div>
                </div>
            </div>



            <main className="container mx-auto px-4 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    <EstudianteCalificacionPreview estudianteId={user.id} />
                    <EstudianteHorarioDiario estudianteId={user.id} />
                    <EstudianteAsistenciaPreview estudianteId={user.id} />
                    <EstudiantePagosPreview estudianteId={user.id} />
                    <EstudianteExamenesPreview estudianteId={user.id} />
                </div>
            </main>
        </div>
    );
};