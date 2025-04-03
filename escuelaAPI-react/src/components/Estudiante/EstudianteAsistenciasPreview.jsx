import React, { useState, useEffect } from 'react';
import { Clock, User } from 'lucide-react';
import axios from 'axios';
import {NavLink} from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL;


export const EstudianteAsistenciaPreview = ({estudianteId}) => {
    const [scheduleData, setScheduleData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const stateColors = {
        'Presente': 'bg-green-100 text-green-800',
        'Ausente': 'bg-red-100 text-red-800',
        'Justificado': 'bg-yellow-100 text-yellow-800'
    };

    useEffect(() => {
        const fetchScheduleData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`${API_BASE_URL}/Asistencia/academico/asistencia/${estudianteId}`);

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const todayClasses = response.data.filter(item => {
                    const itemDate = new Date(item.fecha);
                    itemDate.setHours(0, 0, 0, 0);
                    return itemDate.getTime() === today.getTime();
                });

                setScheduleData(todayClasses);
            } catch (err) {
                setError('Error al cargar las asistencias');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchScheduleData();
    }, []);

    const getStateSummary = () => {
        const summary = {};
        scheduleData.forEach(item => {
            summary[item.estado] = (summary[item.estado] || 0) + 1;
        });
        return summary;
    };

    const renderClassCard = (classItem) => (
        <div
            key={`${classItem.fecha}-${classItem.materia}`}
            className="border border-gray-100 rounded-lg p-4 hover:bg-indigo-50/30 transition-all shadow-sm"
        >
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-gray-800">{classItem.materia}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${stateColors[classItem.estado]}`}>
                    {classItem.estado}
                </span>
            </div>

            <div className="space-y-3">
                <div className="flex items-center text-sm text-indigo-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{`${classItem.horaInicio} - ${classItem.horaFin}`}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    <span>{classItem.docente}</span>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-4 text-red-600">
                {error}
            </div>
        );
    }

    return (
        <div className="bg-white shadow-lg rounded-xl border p-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                    Asistencias de hoy ({new Date().toLocaleDateString('es-ES', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long'
                })})
                </h2>
            </div>

            <div className="space-y-4">
                <div className="grid gap-4 grid-cols-1">
                    {scheduleData.length > 0 ? (
                        scheduleData.map(renderClassCard)
                    ) : (
                        <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
                            No hay asistencias registradas para hoy
                        </div>
                    )}
                </div>

                {scheduleData.length > 0 && (
                    <div className="mt-6 pt-4 border-t">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">
                            Resumen del día
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                            {Object.entries(getStateSummary()).map(([state, count]) => (
                                <div key={state}
                                     className={`p-3 rounded-lg ${stateColors[state]} bg-opacity-20 text-center`}>
                                    <div className="text-lg font-bold">{count}</div>
                                    <div className="text-xs">{state}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <NavLink to="/estudiante/asistencia" className="text-indigo-600">Ver todas las asistencias</NavLink>
        </div>
    );
};