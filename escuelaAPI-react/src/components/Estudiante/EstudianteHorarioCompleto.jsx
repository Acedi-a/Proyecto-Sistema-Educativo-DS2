
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Clock, Calendar, User, BookOpen, ArrowLeft, ArrowRight } from "lucide-react";
import {useAuth} from "../Auth/AuthContext.jsx";


const API_BASE_URL = import.meta.env.VITE_API_URL;


export const EstudianteHorarioCompleto = () => {
    const [horario, setHorario] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [vistaActual, setVistaActual] = useState('diaria');
    const [diaSeleccionado, setDiaSeleccionado] = useState(0);
    const {user} = useAuth();

    // Configuración de colores y estilos
    const colorFondoDias = {
        "Lunes": "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100",
        "Martes": "bg-gradient-to-r from-purple-50 to-violet-50 border-purple-100",
        "Miércoles": "bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-100",
        "Jueves": "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-100",
        "Viernes": "bg-gradient-to-r from-red-50 to-pink-50 border-red-100"
    };

    const colorTarjetaMaterias = {
        "Lunes": "from-blue-500 to-indigo-600",
        "Martes": "from-purple-500 to-violet-600",
        "Miércoles": "from-emerald-500 to-green-600",
        "Jueves": "from-amber-500 to-yellow-600",
        "Viernes": "from-red-500 to-pink-600"
    };

    const iconosMaterias = {
        "Matematica": "📐",
        "Lengua y Literatura": "📚",
        "Ciencias Naturales": "🔬",
        "Historia": "🏛️",
        "Geografía": "🌍",
        "Educación Física": "🏃",
        "Inglés": "🌐",
        "Arte": "🎨",
        "Informática": "💻",
        "Filosofía": "🧠",
        "Economía": "📊"
    };

    useEffect(() => {
        const fetchHorario = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/Horario/academico/horario/${user.id}`);
                setHorario(response.data);
                setLoading(false);
            } catch (err) {
                setError("Error al cargar el horario");
                setLoading(false);
            }
        };

        fetchHorario();
    }, []);

    const formatearHora = (hora) => {
        return hora.substring(0, 5);
    };

    const siguienteDia = () => {
        setDiaSeleccionado((prev) => (prev < horario.length - 1 ? prev + 1 : 0));
    };

    const anteriorDia = () => {
        setDiaSeleccionado((prev) => (prev > 0 ? prev - 1 : horario.length - 1));
    };

    if (loading) {
        return (
            <div className="bg-white min-h-screen p-8">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white min-h-screen p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center text-red-500 p-10 rounded-xl border border-red-100 bg-red-50">
                        <h2 className="text-xl font-bold mb-2">Error</h2>
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Cabecera */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 border border-indigo-100">
                    <div className="p-6 bg-gradient-to-r from-indigo-600 to-violet-700 text-white">
                        <h1 className="text-2xl font-bold mb-2">Horario Académico</h1>
                        <p>Visualiza todas tus clases y organiza tu semana</p>
                    </div>

                    {/* Selector de vista */}
                    <div className="bg-white p-4 border-b border-indigo-100 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setVistaActual('diaria')}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    vistaActual === 'diaria'
                                        ? 'bg-indigo-100 text-indigo-800 font-medium'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Vista Diaria
                            </button>
                            <button
                                onClick={() => setVistaActual('semanal')}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    vistaActual === 'semanal'
                                        ? 'bg-indigo-100 text-indigo-800 font-medium'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Vista Semanal
                            </button>
                        </div>

                        {vistaActual === 'diaria' && (
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={anteriorDia}
                                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                <h2 className="text-lg font-medium text-gray-800">
                                    {horario[diaSeleccionado]?.diaSemana || "Día"}
                                </h2>
                                <button
                                    onClick={siguienteDia}
                                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                                >
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Vista diaria */}
                {vistaActual === 'diaria' && horario[diaSeleccionado] && (
                    <div className={`bg-white rounded-xl shadow-lg overflow-hidden border ${
                        colorFondoDias[horario[diaSeleccionado].diaSemana] || "border-gray-100"
                    }`}>
                        <div className={`p-6 ${colorFondoDias[horario[diaSeleccionado].diaSemana] || "bg-gray-50"}`}>
                            <h2 className="text-xl font-bold text-gray-800 mb-6">
                                Horario del {horario[diaSeleccionado].diaSemana}
                            </h2>

                            <div className="space-y-6">
                                {horario[diaSeleccionado].clases.map((clase, index) => (
                                    <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden border border-indigo-50 hover:shadow-lg transition-all">
                                        <div className={`bg-gradient-to-r ${
                                            colorTarjetaMaterias[horario[diaSeleccionado].diaSemana] || "from-gray-500 to-gray-600"
                                        } text-white p-4 flex justify-between items-center`}>
                                            <div className="flex items-center">
                        <span className="text-2xl mr-3">
                          {iconosMaterias[clase.nombreMateria] || "📘"}
                        </span>
                                                <h3 className="font-bold">{clase.nombreMateria}</h3>
                                            </div>
                                            <div className="font-medium bg-white/20 px-3 py-1 rounded-lg backdrop-blur-sm">
                                                {formatearHora(clase.horaInicio)} - {formatearHora(clase.horaFin)}
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <div className="flex items-center mb-3">
                                                <User className="text-indigo-500 mr-2" size={18} />
                                                <span className="text-gray-700 font-medium">Profesor:</span>
                                                <span className="ml-2 text-gray-900">{clase.nombreDocente}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="text-indigo-500 mr-2" size={18} />
                                                <span className="text-gray-700 font-medium">Duración:</span>
                                                <span className="ml-2 text-gray-900">
                          {Math.round((new Date(`2000-01-01T${clase.horaFin}`) - new Date(`2000-01-01T${clase.horaInicio}`)) / 60000)} minutos
                        </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Vista semanal */}
                {vistaActual === 'semanal' && (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100">
                        <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-indigo-100">
                            {horario.map((dia, index) => (
                                <div key={index} className="p-4">
                                    <div className={`rounded-lg p-2 mb-4 font-semibold text-center ${colorFondoDias[dia.diaSemana] || "bg-gray-50 border-gray-100 border"}`}>
                                        {dia.diaSemana}
                                    </div>
                                    <div className="space-y-3">
                                        {dia.clases.map((clase, idx) => (
                                            <div
                                                key={idx}
                                                className={`p-3 rounded-lg border border-gray-100 hover:shadow-md transition-all hover:border-${dia.diaSemana === 'Lunes' ? 'blue' : dia.diaSemana === 'Martes' ? 'purple' : dia.diaSemana === 'Miércoles' ? 'emerald' : dia.diaSemana === 'Jueves' ? 'amber' : 'red'}-200`}
                                            >
                                                <div className="flex items-center mb-2">
                          <span className="text-xl mr-2">
                            {iconosMaterias[clase.nombreMateria] || "📘"}
                          </span>
                                                    <h3 className="font-medium text-gray-800 line-clamp-1">{clase.nombreMateria}</h3>
                                                </div>
                                                <div className="text-sm text-gray-600 mb-1 line-clamp-1">
                                                    <User size={12} className="inline mr-1" /> {clase.nombreDocente}
                                                </div>
                                                <div className="text-sm font-medium text-indigo-600">
                                                    <Clock size={12} className="inline mr-1" /> {formatearHora(clase.horaInicio)} - {formatearHora(clase.horaFin)}
                                                </div>
                                            </div>
                                        ))}
                                        {dia.clases.length === 0 && (
                                            <div className="text-center py-6 text-gray-400">
                                                <p>No hay clases</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Leyenda de materias */}
                <div className="bg-white rounded-xl shadow-md mt-6 p-4 border border-indigo-100">
                    <h3 className="font-medium text-gray-800 mb-3">Leyenda de Materias</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {Object.entries(iconosMaterias).map(([materia, icono], index) => (
                            <div key={index} className="flex items-center bg-gray-50 p-2 rounded-lg">
                                <span className="text-xl mr-2">{icono}</span>
                                <span className="text-sm text-gray-700 truncate">{materia}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};