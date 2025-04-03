import React, { useState, useEffect, useMemo } from 'react';

const API_BASE_URL = 'https://localhost:7279/api';

const ProfileLoadingSkeleton = () => (
    <header className="bg-gradient-to-r from-violet-600 to-indigo-700 text-white rounded-lg shadow-lg overflow-hidden animate-pulse">
        <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Placeholder Imagen */}
                <div className="rounded-full bg-white/30 w-32 h-32 flex-shrink-0"></div>
                {/* Placeholder Info */}
                <div className="text-center md:text-left flex-1 space-y-4 mt-4 md:mt-0">
                    <div className="h-8 bg-white/30 rounded w-3/4 mx-auto md:mx-0"></div>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                        <div className="h-6 bg-white/30 rounded-full w-24"></div>
                        <div className="h-6 bg-white/30 rounded-full w-20"></div>
                    </div>
                    <div className="h-5 bg-white/30 rounded w-1/2 mx-auto md:mx-0"></div>
                    <div className="h-5 bg-white/30 rounded w-2/3 mx-auto md:mx-0"></div>
                </div>
            </div>
        </div>
    </header>
);

export const EstudiantePerfil = React.memo(({ estudiante, children }) => {
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        setImageError(false);
    }, [estudiante?.id]);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        try {
            const backendUrl = new URL(API_BASE_URL);
            return `${backendUrl.protocol}//${backendUrl.host}/${imagePath.replace(/^\//, '')}`;
        } catch (error) {
            console.error("Error constructing image URL:", error);
            return null;
        }
    };

    const imageUrl = useMemo(() => getImageUrl(estudiante?.imagenPath), [estudiante?.imagenPath]);

    const handleImageError = () => {
        setImageError(true);
    };

    if (!estudiante) {
        return <ProfileLoadingSkeleton />;
    }

    const initials = `${estudiante.nombre?.[0] ?? ''}${estudiante.apellido?.[0] ?? ''}`.toUpperCase();
    const nombreCompleto = `${estudiante.nombre} ${estudiante.apellido}`;

    return (
        <header className="bg-gradient-to-r from-violet-600 to-indigo-700 text-white shadow-lg rounded-lg overflow-hidden animate-fade-in">
            <div className="container mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-x-8 gap-y-4">
                    <div className="relative flex-shrink-0 group">
                        <div className="rounded-full overflow-hidden w-32 h-32 ring-4 ring-white ring-opacity-50 shadow-xl transform transition duration-300 group-hover:scale-105">
                            {imageUrl && !imageError ? (
                                <img
                                    src={imageUrl}
                                    alt={`Foto de perfil de ${nombreCompleto}`}
                                    className="w-full h-full object-cover"
                                    onError={handleImageError}
                                    loading="lazy" 
                                />
                            ) : (
                                <div className="w-full h-full bg-indigo-400 flex items-center justify-center">
                                    <span className="text-4xl font-bold text-white">{initials}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Contenedor de la Información */}
                    <div className="text-center md:text-left flex-1 mt-4 md:mt-0">
                        <h1 className="text-3xl lg:text-4xl font-bold mb-2 drop-shadow-md">{nombreCompleto}</h1>

                        {/* Badges con iconos (simulados) */}
                        <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
                            <span className="inline-flex items-center bg-indigo-100 text-indigo-800 text-sm font-semibold px-4 py-1.5 rounded-full shadow-sm">
                                <span className="mr-1.5" aria-hidden="true">🎓</span> {/* Reemplazar con icono real */}
                                Curso: {estudiante.curso?.nombreCurso || 'No asignado'}
                            </span>
                            <span className="inline-flex items-center bg-purple-100 text-purple-800 text-sm font-semibold px-4 py-1.5 rounded-full shadow-sm">
                                <span className="mr-1.5" aria-hidden="true">⏰</span> {/* Reemplazar con icono real */}
                                Turno: {estudiante.curso?.turno || 'N/A'}
                            </span>
                        </div>

                        {/* Información Adicional */}
                        <div className="space-y-1 text-lg">
                            <p>
                                <span className="font-semibold text-indigo-200">Rol:</span>
                                <span className="ml-2">{estudiante.rol || 'No especificado'}</span>
                            </p>
                            <p>
                                <span className="font-semibold text-indigo-200">Tutor:</span>
                                <span className="ml-2">{estudiante.tutor || 'No asignado'}</span>
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </header>
    );
});
