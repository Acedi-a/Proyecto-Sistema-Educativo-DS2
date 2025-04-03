import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext.jsx';

// --- Constantes Configurables ---
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:7279/api';

// ------------------------------

// Helper para obtener la fecha actual en formato YYYY-MM-DD
const getCurrentDateISO = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localDate = new Date(today.getTime() - (offset*60*1000));
    return localDate.toISOString().split('T')[0];
}

export const ListarMisEstudiantes = () => {
    const navigate = useNavigate();
    const {user} = useAuth();
const DOCENTE_ID_QUEMADO = user.id; // ID del docente quemado como solicitaste
    // --- Estados del Componente ---
    const [materias, setMaterias] = useState([]);
    const [estudiantes, setEstudiantes] = useState([]);
    const [selectedMateriaId, setSelectedMateriaId] = useState('');
    const [selectedMateriaNombre, setSelectedMateriaNombre] = useState('');
    const [loadingMaterias, setLoadingMaterias] = useState(false);
    const [loadingEstudiantes, setLoadingEstudiantes] = useState(false);
    const [error, setError] = useState(null);

    // --- Estados para el Formulario de Calificación ---
    const [selectedEstudiante, setSelectedEstudiante] = useState(null);
    const [nota, setNota] = useState('');
    const [comentarios, setComentarios] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState({ type: '', message: '' });

    // --- Efecto para cargar las materias ---
    useEffect(() => {
        const fetchMaterias = async () => {
            setLoadingMaterias(true);
            setError(null);
            setMaterias([]);
            setEstudiantes([]);
            setSelectedMateriaId('');
            setSelectedEstudiante(null);
            setSubmissionStatus({ type: '', message: '' });

            try {
                const response = await axios.get(`${API_URL}/Calificacion/materias/${DOCENTE_ID_QUEMADO}`);
                setMaterias(response.data);
            } catch (err) {
                console.error("Error fetching materias:", err);
                const errorMsg = err.response?.data?.message || err.response?.data || 'Error al cargar las materias.';
                setError(errorMsg);
                setMaterias([]);
            } finally {
                setLoadingMaterias(false);
            }
        };
        fetchMaterias();
    }, []);

    // --- Efecto para cargar los estudiantes ---
    useEffect(() => {
        if (selectedMateriaId) {
            const fetchEstudiantes = async () => {
                setLoadingEstudiantes(true);
                setError(null);
                setEstudiantes([]);
                setSelectedEstudiante(null);
                setSubmissionStatus({ type: '', message: '' });

                try {
                    const response = await axios.get(`${API_URL}/Calificacion/listarEstudiantes/${DOCENTE_ID_QUEMADO}/${selectedMateriaId}`);
                    setEstudiantes(response.data);
                    
                    // Obtener el nombre de la materia seleccionada
                    const materiaSeleccionada = materias.find(m => m.idMateria == selectedMateriaId);
                    if (materiaSeleccionada) {
                        setSelectedMateriaNombre(materiaSeleccionada.nombreMateria);
                    }
                } catch (err) {
                    console.error("Error fetching estudiantes:", err);
                    const errorMsg = err.response?.data?.message || err.response?.data || 'Error al cargar los estudiantes.';
                    if (err.response && err.response.status === 404) {
                        setError(errorMsg || 'No se encontraron estudiantes para la materia seleccionada.');
                    } else {
                        setError(errorMsg);
                    }
                    setEstudiantes([]);
                } finally {
                    setLoadingEstudiantes(false);
                }
            };
            fetchEstudiantes();
        } else {
            setEstudiantes([]);
            setSelectedEstudiante(null);
        }
    }, [selectedMateriaId]);

    // --- Manejador para cambio de materia ---
    const handleMateriaChange = (event) => {
        setSelectedMateriaId(event.target.value);
    };

    // --- Manejador para seleccionar un estudiante ---
    const handleSelectEstudiante = (estudiante) => {
        setSelectedEstudiante(estudiante);
        setNota('');
        setComentarios('');
        setSubmissionStatus({ type: '', message: '' });
        setError(null);
    };

    // --- Manejador para redirigir al componente de boletín ---
    const handleVerBoletin = (idEstudiante) => {
        navigate(`/docente/boletin/${idEstudiante}`);
    };

    // --- Manejador para el envío del formulario de calificación ---
    const handleGradeSubmit = async (event) => {
        event.preventDefault();
        if (!selectedEstudiante || isSubmitting) return;

        setIsSubmitting(true);
        setSubmissionStatus({ type: '', message: '' });

        const notaValue = parseFloat(nota);
        if (isNaN(notaValue)) {
            setSubmissionStatus({ type: 'error', message: 'La nota debe ser un número válido.' });
            setIsSubmitting(false);
            return;
        }
        if (notaValue < 0 || notaValue > 100) {
            setSubmissionStatus({ type: 'error', message: 'La nota debe estar entre 0 y 100.' });
            setIsSubmitting(false);
            return;
        }

        const payload = {
            nota: notaValue,
            comentarios: comentarios.trim(),
            idEstudiante: selectedEstudiante.idUsuario,
            idCurso: selectedEstudiante.idCurso,
            fechaRegistro: getCurrentDateISO(),
            idMateria: selectedEstudiante.idMateria
        };

        try {
            const response = await axios.post(`${API_URL}/Calificacion/Registrar`, payload);
            setSubmissionStatus({ type: 'success', message: '¡Calificación registrada con éxito!' });
            setNota('');
            setComentarios('');
        } catch (err) {
            console.error("Error submitting grade:", err);
            const errorMsg = err.response?.data?.message || err.response?.data?.title || err.response?.data || 'Error al registrar la calificación.';
            setSubmissionStatus({ type: 'error', message: errorMsg });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Registrar Calificación de Estudiante</h1>

            {/* --- Sección de Selección de Materia --- */}
            <div className="mb-6 p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
                <label htmlFor="materiaSelect" className="block text-sm font-medium text-gray-700 mb-2">
                    Selecciona una Materia:
                </label>
                {loadingMaterias ? (
                    <p className="text-gray-500 italic">Cargando materias...</p>
                ) : (
                    <select
                        id="materiaSelect"
                        value={selectedMateriaId}
                        onChange={handleMateriaChange}
                        className={`block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${materias.length === 0 && !error ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                        disabled={loadingMaterias || materias.length === 0}
                    >
                        <option value="">-- Selecciona una materia --</option>
                        {materias.map((materia) => (
                            <option key={materia.idMateria} value={materia.idMateria}>
                                {materia.nombreMateria}
                            </option>
                        ))}
                    </select>
                )}
                {!loadingMaterias && materias.length === 0 && !error && (
                    <p className="text-sm text-red-600 mt-1">No se encontraron materias para este docente (ID: {DOCENTE_ID_QUEMADO}).</p>
                )}
            </div>

            {/* --- Mensaje de Error General --- */}
            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    <p><span className="font-semibold">Error:</span> {typeof error === 'string' ? error : 'Ocurrió un error inesperado.'}</p>
                </div>
            )}

            {/* --- Sección de Lista de Estudiantes --- */}
            {selectedMateriaId && !error && (
                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-3 text-gray-700">
                        Estudiantes de: {selectedMateriaNombre}
                    </h2>
                    {loadingEstudiantes ? (
                        <p className="text-gray-500 italic">Cargando estudiantes...</p>
                    ) : estudiantes.length > 0 ? (
                        <div className="overflow-x-auto shadow-md sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200 bg-white">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellido</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Curso</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {estudiantes.map((estudiante) => (
                                        <tr
                                            key={estudiante.idUsuario}
                                            className={`${selectedEstudiante?.idUsuario === estudiante.idUsuario ? 'bg-indigo-100' : 'hover:bg-gray-50'}`}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{estudiante.nombre}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{estudiante.apellido}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{estudiante.nombreCurso}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                                     
                                                <button
                                                    onClick={() => handleVerBoletin(estudiante.idUsuario)}
                                                    className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                                                >
                                                    Ver Boletín
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        !loadingEstudiantes && !error && (
                            <p className="text-gray-600 mt-2">No se encontraron estudiantes para esta materia.</p>
                        )
                    )}
                </div>
            )}

            {/* --- Sección del Formulario de Calificación --- */}
            {selectedEstudiante && (
                <div className="mt-8 p-6 border border-indigo-200 rounded-lg shadow-lg bg-white">
                    <h3 className="text-lg font-semibold mb-4 text-indigo-800">
                        Registrar Calificación para: {selectedEstudiante.nombre} {selectedEstudiante.apellido}
                    </h3>
                    <form onSubmit={handleGradeSubmit}>
                        <div className="mb-4">
                            <label htmlFor="nota" className="block text-sm font-medium text-gray-700 mb-1">Nota (0-100):</label>
                            <input
                                type="number"
                                id="nota"
                                name="nota"
                                value={nota}
                                onChange={(e) => setNota(e.target.value)}
                                min="0"
                                max="100"
                                step="0.1"
                                required
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="comentarios" className="block text-sm font-medium text-gray-700 mb-1">Comentarios:</label>
                            <textarea
                                id="comentarios"
                                name="comentarios"
                                rows="3"
                                value={comentarios}
                                onChange={(e) => setComentarios(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                disabled={isSubmitting}
                            />
                        </div>

                        {submissionStatus.message && (
                            <div className={`mb-4 p-3 rounded text-sm ${submissionStatus.type === 'success' ? 'bg-green-100 border border-green-300 text-green-800' : 'bg-red-100 border border-red-300 text-red-800'}`}>
                                {submissionStatus.message}
                            </div>
                        )}

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Registrando...' : 'Registrar Calificación'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}