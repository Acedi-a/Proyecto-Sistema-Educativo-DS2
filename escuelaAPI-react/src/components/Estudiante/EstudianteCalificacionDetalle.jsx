import React from 'react';
import { BookOpen, User, Calendar, Award, MessageCircle } from 'lucide-react';

export const EstudianteCalificacionDetalle = ({ calificacion }) => {
    const getNotaInfo = (nota) => {
        if (nota >= 90) return { color: 'bg-emerald-500', text: 'Excelente', textColor: 'text-emerald-500' };
        if (nota >= 80) return { color: 'bg-blue-500', text: 'Muy Bueno', textColor: 'text-blue-500' };
        if (nota >= 70) return { color: 'bg-yellow-500', text: 'Bueno', textColor: 'text-yellow-500' };
        if (nota >= 60) return { color: 'bg-orange-500', text: 'Regular', textColor: 'text-orange-500' };
        return { color: 'bg-red-500', text: 'Necesita Mejorar', textColor: 'text-red-500' };
    };

    const notaInfo = getNotaInfo(calificacion.nota);
    const fechaFormateada = new Date(calificacion.fechaRegistro).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div className="w-full max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Encabezado con la nota */}
                <div className="relative">
                    <div className={`absolute top-0 left-0 w-full h-2 ${notaInfo.color}`}></div>
                    <div className="p-6 pt-8">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Calificación</h2>
                                <p className="text-gray-600">{calificacion.materia?.nombreMateria}</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className={`text-4xl font-bold ${notaInfo.textColor}`}>
                                    {calificacion.nota}
                                </div>
                                <div className="text-sm font-medium text-gray-500">{notaInfo.text}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detalles de la calificación */}
                <div className="px-6 py-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            {/* Información de la materia */}
                            <div className="flex items-start">
                                <BookOpen className="text-indigo-500 mt-1 mr-3" size={20} />
                                <div>
                                    <div className="text-sm font-medium text-gray-500">Materia</div>
                                    <div className="font-medium">{calificacion.materia?.nombreMateria}</div>
                                    <div className="text-sm text-gray-600 mt-1">{calificacion.materia?.descripcion}</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Fecha de registro */}
                            <div className="flex items-start">
                                <Calendar className="text-indigo-500 mt-1 mr-3" size={20} />
                                <div>
                                    <div className="text-sm font-medium text-gray-500">Fecha de Registro</div>
                                    <div className="font-medium">{fechaFormateada}</div>
                                </div>
                            </div>

                            {/* Datos de calificación */}
                            <div className="flex items-start">
                                <Award className="text-indigo-500 mt-1 mr-3" size={20} />
                                <div>
                                    <div className="text-sm font-medium text-gray-500">Detalles</div>
                                    <div className="font-medium">Curso: {calificacion.idCurso}</div>
                                    <div className="font-medium">ID Calificación: {calificacion.idCalificacion}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Comentarios */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="flex items-start">
                            <MessageCircle className="text-indigo-500 mt-1 mr-3" size={20} />
                            <div>
                                <div className="text-sm font-medium text-gray-500">Comentarios del Profesor</div>
                                <div className="mt-1 text-gray-700">{calificacion.comentarios}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

