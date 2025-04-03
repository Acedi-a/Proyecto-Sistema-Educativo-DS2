import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { ClipboardList, Loader, AlertCircle, Calendar } from 'lucide-react';
import {useAuth} from "../Auth/AuthContext.jsx";


const API_BASE_URL = import.meta.env.VITE_API_URL;

const formatFechaExamenCompleta = (fechaISO) => {
    if (!fechaISO) return 'N/A';
    try {
        const fecha = new Date(fechaISO);
        return fecha.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    } catch { return 'Fecha inválida'; }
};
const formatHora = (horaString) => {
    if (!horaString) return 'N/A';
    try {
        const [h, m] = horaString.split(':');
        return `${h}:${m}`;
    } catch { return 'Hora inválida'; }
};

export const EstudianteExamenesCompleto = () => {
    const { user } = useAuth();

    const [examenes, setExamenes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                const sortedExamenes = response.data.sort((a, b) => new Date(b.fechaExamen) - new Date(a.fechaExamen));
                setExamenes(sortedExamenes);
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
        <div className="container mx-auto p-6">
            <nav aria-label="breadcrumb" className="mb-6">
                <ol className="flex space-x-2 text-sm text-gray-500">
                    <li><Link to="/estudiante" className="hover:text-indigo-600">Dashboard</Link></li>
                    <li><span className="mx-2">/</span></li>
                    <li className="font-medium text-gray-700" aria-current="page">Calendario de Exámenes</li>
                </ol>
            </nav>

            <h1 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-3">
                <Calendar className="text-indigo-600" /> Calendario de Exámenes
            </h1>

            {loading && (
                <div className="flex justify-center mt-10">
                    <Loader className="animate-spin text-indigo-600" size={48} />
                </div>
            )}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold"><AlertCircle size={16} className="inline mr-2"/> Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {!loading && !error && examenes.length === 0 && (
                <div className="text-center py-10">
                    <ClipboardList size={48} className="mx-auto text-gray-400 mb-4"/>
                    <p className="text-gray-500">No tienes exámenes registrados en el calendario.</p>
                </div>
            )}

            {!loading && !error && examenes.length > 0 && (
                <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Materia</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horario</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Día</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {examenes.map((examen, index) => {
                            const hoy = new Date();
                            hoy.setHours(0,0,0,0); // Comparar solo fechas
                            const fechaExamenDate = new Date(examen.fechaExamen);
                            const isPast = fechaExamenDate < hoy;
                            const isToday = fechaExamenDate.getTime() === hoy.getTime();

                            return (
                                <tr key={index} className={`${isPast ? 'bg-gray-50 opacity-70' : isToday ? 'bg-blue-50' : ''} hover:bg-gray-100 transition-colors`}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{formatFechaExamenCompleta(examen.fechaExamen)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-800">{examen.nombreMateria}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-600">{formatHora(examen.horaInicio)} - {formatHora(examen.horaFin)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-600">{examen.diaSemana}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {isPast ? (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-600">
                                                    Pasado
                                                </span>
                                        ) : isToday ? (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 animate-pulse">
                                                    ¡Hoy!
                                                </span>
                                        ) : (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    Próximo ({examen.diasRestantes} días)
                                                </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};