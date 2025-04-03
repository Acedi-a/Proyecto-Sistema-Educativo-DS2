
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Clock, Calendar, User, BookOpen, ArrowLeft, ArrowRight, PartyPopper } from "lucide-react";
import {NavLink} from "react-router-dom";


const API_BASE_URL = import.meta.env.VITE_API_URL;


export const EstudianteHorarioDiario = ({estudianteId}) => {
    const [horario, setHorario] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const diaActual = diasSemana[new Date().getDay()];


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
        const fetchHorario = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/Horario/academico/horario/${estudianteId}`);
                setHorario(response.data);
                setLoading(false);
            } catch (err) {
                setError("Error al cargar el horario");
                setLoading(false);
            }
        };

        fetchHorario();
    }, []);

    const clasesHoy = !loading && horario.find(dia => dia.diaSemana === diaActual);

    const formatearHora = (hora) => {
        return hora.substring(0, 5);
    };

    const esClaseActual = (horaInicio, horaFin) => {
        const ahora = new Date();
        const horaActual = `${ahora.getHours()}:${ahora.getMinutes().toString().padStart(2, '0')}`;

        return horaActual >= formatearHora(horaInicio) && horaActual <= formatearHora(horaFin);
    };

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

    if (!clasesHoy || !clasesHoy.clases || clasesHoy.clases.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-50">
                <div className="p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 border-b border-indigo-100">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-900">
                        <Calendar className="text-indigo-600" size={20} />
                        Clases de Hoy
                    </h2>
                </div>
                <div className="p-6">
                    <div className="flex flex-col items-center justify-center h-40 text-center">
                        <PartyPopper className="text-indigo-600" size={25} />
                        <p className="text-gray-500 font-medium">No hay clases programadas para hoy</p>
                        <p className="text-sm text-gray-400">¡Disfruta tu día libre!</p>
                    </div>
                </div>
                <NavLink to={"/estudiante/horario"} className="text-indigo-600">Ver horario completo</NavLink>

            </div>
        );
    }

    return (

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-50 hover:shadow-xl transition-shadow">
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 border-b border-indigo-100">
                <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-900">
                    <Calendar className="text-indigo-600" size={20} />
                    Clases de Hoy
                </h2>
            </div>
            <div className="p-4">
                <div className="bg-indigo-50 text-indigo-800 font-medium py-2 px-4 rounded-lg mb-3">
                    {diaActual}
                </div>
                <div className="space-y-3">
                    {clasesHoy.clases.map((clase, index) => (
                        <div
                            key={index}
                            className={`rounded-lg p-4 border transition-all ${
                                esClaseActual(clase.horaInicio, clase.horaFin)
                                    ? "border-indigo-300 bg-indigo-50 shadow-md"
                                    : "border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30"
                            }`}
                        >
                            <div className="flex items-start">
                                <div className={`flex-shrink-0 w-2 h-full rounded-full mr-3 ${coloresMaterias[clase.nombreMateria] || "bg-gray-400"}`}></div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-800">{clase.nombreMateria}</h3>
                                    <div className="flex items-center text-gray-500 text-sm mt-1">
                                        <User size={14} className="mr-1" />
                                        <span>{clase.nombreDocente}</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center text-indigo-600 text-sm font-medium">
                                            <Clock size={14} className="mr-1" />
                                            <span>
                        {formatearHora(clase.horaInicio)} - {formatearHora(clase.horaFin)}
                      </span>
                                        </div>
                                        {esClaseActual(clase.horaInicio, clase.horaFin) && (
                                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        En curso
                      </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <NavLink to={"/estudiante/horario"} className="text-indigo-600">Ver horario completo</NavLink>

        </div>

    );
};