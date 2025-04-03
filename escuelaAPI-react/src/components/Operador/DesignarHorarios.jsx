import { useState, useEffect } from 'react';
import { appsettings } from "../../settings/appsettings";
import { useNavigate } from 'react-router-dom';

export function DesignarHorarios() {
    const [horario, setHorario] = useState({
        diaSemana: '',
        horaInicio: '',
        horaFin: '',
        idCurso: 0,
        idDocente: 0,
        idMateria: 0
    });
    const navigate = useNavigate();

    const [cursos, setCursos] = useState([]);
    const [docentes, setDocentes] = useState([]);
    const [materias, setMaterias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                // Cargar cursos
                const resCursos = await fetch(`${appsettings.ApiUrl}Curso/listar`);
                if (!resCursos.ok) throw new Error("Error al cargar cursos");
                const dataCursos = await resCursos.json();
                setCursos(dataCursos);

                // Cargar docentes
                const resDocentes = await fetch(`${appsettings.ApiUrl}Docente/listarDocente`);
                if (!resDocentes.ok) throw new Error("Error al cargar docentes");
                const dataDocentes = await resDocentes.json();
                setDocentes(dataDocentes);

                // Cargar materias
                const resMaterias = await fetch(`${appsettings.ApiUrl}Materia/listar`);
                if (!resMaterias.ok) throw new Error("Error al cargar materias");
                const dataMaterias = await resMaterias.json();
                setMaterias(dataMaterias);

            } catch (err) {
                console.error("Error cargando datos:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setHorario(prev => ({ 
            ...prev, 
            [name]: name.includes('id') ? parseInt(value) || 0 : value 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            // Validación básica
            if (!horario.diaSemana) throw new Error("Seleccione un día de la semana");
            if (!horario.horaInicio || !horario.horaFin) throw new Error("Complete las horas de inicio y fin");
            if (horario.idCurso <= 0) throw new Error("Seleccione un curso válido");
            if (horario.idDocente <= 0) throw new Error("Seleccione un docente válido");
            if (horario.idMateria <= 0) throw new Error("Seleccione una materia válida");

            // Formatear fechas para el backend
            const formatTimeToDateTime = (timeStr) => {
                if (!timeStr) return null;
                const [hours, minutes] = timeStr.split(':');
                const date = new Date();
                date.setHours(parseInt(hours));
                date.setMinutes(parseInt(minutes));
                date.setSeconds(0);
                return date.toISOString();
            };

            const payload = {
                ...horario,
                horaInicio: formatTimeToDateTime(horario.horaInicio),
                horaFin: formatTimeToDateTime(horario.horaFin)
            };

            console.log("Enviando datos:", payload);

            const response = await fetch(`${appsettings.ApiUrl}Horario/designarHorario`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            // Manejar respuesta del servidor
            const responseText = await response.text();
            let responseData;
            
            try {
                responseData = JSON.parse(responseText);
            } catch {
                responseData = { message: responseText };
            }

            if (!response.ok) {
                throw new Error(responseData.message || `Error ${response.status}: ${response.statusText}`);
            }

            setSuccess(responseData.message || "Horario designado exitosamente");
            navigate("/ListarHorarios");
            
            // Resetear formulario
            setHorario({
                diaSemana: '',
                horaInicio: '',
                horaFin: '',
                idCurso: 0,
                idDocente: 0,
                idMateria: 0
            });

        } catch (err) {
            console.error("Error al enviar horario:", err);
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
                <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center animate-pulse">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-blue-700 font-medium text-lg">Cargando datos necesarios...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 p-6 flex justify-center items-start">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full border-l-4 border-red-500 animate-fadeIn">
                    <div className="flex items-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className="text-xl font-bold text-gray-800">Error</h2>
                    </div>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button 
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 flex items-center"
                        onClick={() => window.location.reload()}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Recargar página
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 transform hover:shadow-2xl">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-white">Designar Horario</h2>
                </div>
                <div className="p-6">
                    {success && (
                        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg flex items-start animate-fadeIn">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="flex-grow">
                                <p className="text-green-700">{success}</p>
                            </div>
                            <button 
                                className="text-green-700 hover:text-green-900"
                                onClick={() => setSuccess(null)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    )}
                    
                    {error && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start animate-fadeIn">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="flex-grow">
                                <p className="text-red-700">{error}</p>
                            </div>
                            <button 
                                className="text-red-700 hover:text-red-900"
                                onClick={() => setError(null)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-2 group">
                                <label htmlFor="diaSemana" className="flex items-center text-sm font-medium text-gray-700 group-hover:text-blue-700 transition-colors duration-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Día de la semana <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        id="diaSemana"
                                        name="diaSemana"
                                        value={horario.diaSemana}
                                        onChange={handleChange}
                                        className="block w-full pl-3 pr-10 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300"
                                        required
                                    >
                                        <option value="">Seleccione un día</option>
                                        <option value="Lunes">Lunes</option>
                                        <option value="Martes">Martes</option>
                                        <option value="Miércoles">Miércoles</option>
                                        <option value="Jueves">Jueves</option>
                                        <option value="Viernes">Viernes</option>
                                        <option value="Sábado">Sábado</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 group">
                                <label htmlFor="horaInicio" className="flex items-center text-sm font-medium text-gray-700 group-hover:text-blue-700 transition-colors duration-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Hora de inicio <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="horaInicio"
                                    type="time"
                                    name="horaInicio"
                                    value={horario.horaInicio}
                                    onChange={handleChange}
                                    className="block w-full px-3 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300"
                                    required
                                />
                            </div>

                            <div className="space-y-2 group">
                                <label htmlFor="horaFin" className="flex items-center text-sm font-medium text-gray-700 group-hover:text-blue-700 transition-colors duration-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Hora de fin <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="horaFin"
                                    type="time"
                                    name="horaFin"
                                    value={horario.horaFin}
                                    onChange={handleChange}
                                    className="block w-full px-3 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300"
                                    required
                                />
                            </div>

                            <div className="space-y-2 group">
                                <label htmlFor="idCurso" className="flex items-center text-sm font-medium text-gray-700 group-hover:text-blue-700 transition-colors duration-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    Curso <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        id="idCurso"
                                        name="idCurso"
                                        value={horario.idCurso}
                                        onChange={handleChange}
                                        className="block w-full pl-3 pr-10 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300"
                                        required
                                    >
                                        <option value="0">Seleccione un curso</option>
                                        {cursos.map(curso => (
                                            <option key={curso.idCurso} value={curso.idCurso}>
                                                {curso.nombreCurso} - {curso.turno}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 group">
                                <label htmlFor="idDocente" className="flex items-center text-sm font-medium text-gray-700 group-hover:text-blue-700 transition-colors duration-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Docente <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        id="idDocente"
                                        name="idDocente"
                                        value={horario.idDocente}
                                        onChange={handleChange}
                                        className="block w-full pl-3 pr-10 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300"
                                        required
                                    >
                                        <option value="0">Seleccione un docente</option>
                                        {docentes.map(docente => (
                                            <option key={docente.idUsuario} value={docente.idUsuario}>
                                                {docente.nombre} {docente.apellido} - {docente.especialidad}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 group">
                                <label htmlFor="idMateria" className="flex items-center text-sm font-medium text-gray-700 group-hover:text-blue-700 transition-colors duration-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                    Materia <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        id="idMateria"
                                        name="idMateria"
                                        value={horario.idMateria}
                                        onChange={handleChange}
                                        className="block w-full pl-3 pr-10 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300"
                                        required
                                    >
                                        <option value="0">Seleccione una materia</option>
                                        {materias.map(materia => (
                                            <option key={materia.idMateria} value={materia.idMateria}>
                                                {materia.nombreMateria}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button 
                                type="submit" 
                                className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center group"
                                disabled={loading}
                            >
                                {loading ? (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                )}
                                Designar Horario
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default DesignarHorarios;