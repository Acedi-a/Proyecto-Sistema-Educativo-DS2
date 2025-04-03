import React, { useState, useMemo, useEffect } from 'react';
import { Clock, Calendar, User, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import {useAuth} from "../Auth/AuthContext.jsx";


const API_BASE_URL = import.meta.env.VITE_API_URL;

export const EstudianteAsistenciaCompleto = () => {
    const [viewType, setViewType] = useState('daily');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [filterState, setFilterState] = useState('all');
    const [scheduleData, setScheduleData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchScheduleData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/Asistencia/academico/asistencia/${user.id}`);
                setScheduleData(response.data);
                setError(null);
            } catch (err) {
                setError('Error al cargar los datos del horario');
                console.error('Error fetching schedule data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchScheduleData();
    }, []);

    const stateColors = {
        'Presente': 'bg-green-100 text-green-800',
        'Ausente': 'bg-red-100 text-red-800',
        'Justificado': 'bg-yellow-100 text-yellow-800'
    };

    const subjectColors = {
        'Economía': 'bg-blue-500',
        'Arte': 'bg-purple-500',
        'Inglés': 'bg-green-500',
        'Historia': 'bg-yellow-500',
        'Lengua y Literatura': 'bg-red-500',
        'Matematica': 'bg-indigo-500'
    };

    const groupedByDate = useMemo(() => {
        const grouped = {};
        scheduleData.forEach(item => {
            const date = new Date(item.fecha);
            const dateStr = date.toISOString().split('T')[0];
            if (!grouped[dateStr]) {
                grouped[dateStr] = [];
            }
            grouped[dateStr].push(item);
        });
        return grouped;
    }, [scheduleData]);

    const filteredAndGroupedData = useMemo(() => {
        const filtered = {};
        Object.entries(groupedByDate).forEach(([date, classes]) => {
            filtered[date] = classes.filter(item =>
                filterState === 'all' ? true : item.estado === filterState
            );
        });
        return filtered;
    }, [groupedByDate, filterState]);

    const navigateDate = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
        setCurrentDate(newDate);
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    };

    const renderClassCard = (classItem) => (
        <div key={`${classItem.fecha}-${classItem.materia}`}
             className="border border-gray-100 rounded-lg p-4 mb-4 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${subjectColors[classItem.materia] || 'bg-gray-500'}`}></div>
                    <h3 className="text-lg font-semibold text-gray-800">{classItem.materia}</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${stateColors[classItem.estado]}`}>
                    {classItem.estado}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm">{`${classItem.horaInicio} - ${classItem.horaFin}`}</span>
                </div>
                <div className="flex items-center justify-end space-x-2 text-gray-600">
                    <User className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm font-medium">{classItem.docente}</span>
                </div>
            </div>
        </div>
    );

    const renderDaySection = (date, classes) => (
        <div key={date} className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 bg-gray-50 p-3 rounded-lg">
                {formatDate(date)}
            </h2>
            <div className="space-y-4">
                {classes.map(renderClassCard)}
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8 text-red-600">
                {error}
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="bg-white shadow-lg rounded-xl border p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                        Registro de Asistencias
                    </h1>

                    <div className="flex space-x-4">
                        <select
                            className="border rounded-lg px-3 py-2 text-gray-700"
                            value={filterState}
                            onChange={(e) => setFilterState(e.target.value)}
                        >
                            <option value="all">Todos los estados</option>
                            <option value="Presente">Presente</option>
                            <option value="Ausente">Ausente</option>
                            <option value="Justificado">Justificado</option>
                        </select>

                        <div className="flex space-x-2">
                            <button
                                className="p-2 rounded-lg hover:bg-gray-100"
                                onClick={() => setViewType(viewType === 'daily' ? 'weekly' : 'daily')}
                            >
                                <Calendar className="w-5 h-5 text-indigo-600" />
                            </button>
                            <button
                                className="p-2 rounded-lg hover:bg-gray-100"
                                onClick={() => navigateDate('prev')}
                            >
                                <ChevronLeft className="w-5 h-5 text-indigo-600" />
                            </button>
                            <button
                                className="p-2 rounded-lg hover:bg-gray-100"
                                onClick={() => navigateDate('next')}
                            >
                                <ChevronRight className="w-5 h-5 text-indigo-600" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {Object.entries(filteredAndGroupedData).length > 0 ? (
                        Object.entries(filteredAndGroupedData)
                            .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
                            .map(([date, classes]) =>
                                classes.length > 0 && renderDaySection(date, classes)
                            )
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No hay registros de asistencia para mostrar
                        </div>
                    )}
                </div>

                <div className="mt-8 border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumen de Asistencias</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {Object.entries(stateColors).map(([state, colorClass]) => {
                            const count = scheduleData.filter(item => item.estado === state).length;
                            return (
                                <div key={state}
                                     className="flex items-center justify-between p-4 rounded-lg border hover:shadow-md transition-all"
                                     style={{borderColor: colorClass.includes('green') ? '#86efac' :
                                             colorClass.includes('red') ? '#fca5a5' :
                                                 colorClass.includes('yellow') ? '#fde047' : '#e5e7eb'}}>
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorClass}`}>
                                            <span className="text-xs font-bold">{count}</span>
                                        </div>
                                        <span className="font-medium text-gray-700">{state}</span>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {((count / scheduleData.length) * 100).toFixed(1)}%
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

