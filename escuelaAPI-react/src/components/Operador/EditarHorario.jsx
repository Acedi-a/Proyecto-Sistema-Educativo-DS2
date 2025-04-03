import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { appsettings } from "../../settings/appsettings";
import { 
  Calendar, 
  Clock, 
  Save, 
  X, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle, 
  Loader2, 
  BookOpen, 
  User, 
  Briefcase, 
  Calendar as CalendarIcon, 
  AlarmClock, 
  AlarmClockOff 
} from 'lucide-react';

export function EditarHorario() {
    const { idHorario } = useParams();
    const navigate = useNavigate();
    const [horario, setHorario] = useState({
        diaSemana: '',
        horaInicio: '',
        horaFin: '',
        idCurso: 0,
        idDocente: 0,
        idMateria: 0
    });
    
    const [cursos, setCursos] = useState([]);
    const [docentes, setDocentes] = useState([]);
    const [materias, setMaterias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Array de días con iconos personalizados
    const diasSemana = [
        { nombre: 'Lunes', icono: <Calendar className="h-5 w-5 text-blue-600" /> },
        { nombre: 'Martes', icono: <Calendar className="h-5 w-5 text-blue-600" /> },
        { nombre: 'Miércoles', icono: <Calendar className="h-5 w-5 text-blue-600" /> },
        { nombre: 'Jueves', icono: <Calendar className="h-5 w-5 text-blue-600" /> },
        { nombre: 'Viernes', icono: <Calendar className="h-5 w-5 text-blue-600" /> },
        { nombre: 'Sábado', icono: <Calendar className="h-5 w-5 text-blue-600" /> }
    ];

    // Cargar datos del horario y listas necesarias
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoading(true);
                
                // Cargar horario existente
                const resHorario = await fetch(`${appsettings.ApiUrl}Horario/obtenerHorario/${idHorario}`);
                if (!resHorario.ok) throw new Error("Error al cargar el horario");
                const dataHorario = await resHorario.json();
                
                // Convertir horas de ISO a formato HH:MM para los inputs
                const formatTimeFromISO = (isoTime) => {
                    if (!isoTime) return '';
                    const date = new Date(isoTime);
                    return date.toTimeString().substring(0, 5);
                };

                setHorario({
                    ...dataHorario,
                    horaInicio: formatTimeFromISO(dataHorario.horaInicio),
                    horaFin: formatTimeFromISO(dataHorario.horaFin)
                });

                // Cargar listas de opciones
                const [resCursos, resDocentes, resMaterias] = await Promise.all([
                    fetch(`${appsettings.ApiUrl}Curso/listar`),
                    fetch(`${appsettings.ApiUrl}Docente/listarDocente`),
                    fetch(`${appsettings.ApiUrl}Materia/listar`)
                ]);

                if (!resCursos.ok || !resDocentes.ok || !resMaterias.ok) {
                    throw new Error("Error al cargar opciones");
                }

                const [dataCursos, dataDocentes, dataMaterias] = await Promise.all([
                    resCursos.json(),
                    resDocentes.json(),
                    resMaterias.json()
                ]);

                setCursos(dataCursos);
                setDocentes(dataDocentes);
                setMaterias(dataMaterias);

            } catch (err) {
                console.error("Error cargando datos:", err);
                setError(err.message);
            } finally {
                setTimeout(() => setLoading(false), 500); // Un pequeño retraso para mostrar la animación
            }
        };

        cargarDatos();
    }, [idHorario]);

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
        setIsSaving(true);

        try {
            // Validación básica
            if (!horario.diaSemana) throw new Error("Seleccione un día de la semana");
            if (!horario.horaInicio || !horario.horaFin) throw new Error("Complete las horas de inicio y fin");
            if (horario.idCurso <= 0) throw new Error("Seleccione un curso válido");
            if (horario.idDocente <= 0) throw new Error("Seleccione un docente válido");
            if (horario.idMateria <= 0) throw new Error("Seleccione una materia válida");

            // Formatear horas para el backend
            const formatTimeToISO = (timeStr) => {
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
                horaInicio: formatTimeToISO(horario.horaInicio),
                horaFin: formatTimeToISO(horario.horaFin)
            };

            const response = await fetch(`${appsettings.ApiUrl}Horario/editarHorario/${idHorario}`, {
                method: 'PUT',
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

            setSuccess(responseData.message || "Horario actualizado correctamente");
            
            // Redirigir después de 2 segundos si la operación fue exitosa
            setTimeout(() => {
                navigate('/ListarHorarios'); // Ajusta la ruta según tu aplicación
            }, 2000);

        } catch (err) {
            console.error("Error al actualizar horario:", err);
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-blue-50 p-6 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full text-center">
                    <div className="mb-4">
                        <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold text-blue-800">Cargando datos del horario</h3>
                    <p className="text-gray-600 mt-2">Por favor espere mientras recuperamos la información...</p>
                </div>
            </div>
        );
    }

    if (error && !success) {
        return (
            <div className="min-h-screen bg-blue-50 p-6 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-red-100 p-3 rounded-full">
                            <AlertCircle className="h-10 w-10 text-red-600" />
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold text-red-700 text-center mb-2">
                        Error al cargar datos
                    </h3>
                    <p className="text-gray-700 text-center mb-6">
                        {error}
                    </p>
                    <div className="flex justify-center">
                        <button 
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300 flex items-center"
                            onClick={() => navigate(-1)}
                        >
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Volver atrás
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-blue-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 flex justify-between items-center">
                        <div className="flex items-center">
                            <Clock className="h-8 w-8 text-white mr-3" />
                            <div>
                                <h1 className="text-2xl font-bold text-white">Editar Horario</h1>
                                <div className="flex items-center mt-1">
                                    <CalendarIcon className="h-4 w-4 text-blue-200 mr-1" />
                                    <span className="text-blue-100 text-sm">ID: {idHorario}</span>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => navigate(-1)}
                            className="bg-blue-700 hover:bg-blue-900 text-white rounded-full p-2 transition-colors duration-300"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Notification messages */}
                    {success && (
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4 mx-6 mt-6 rounded-md animate-fadeIn flex items-start">
                            <CheckCircle className="text-green-500 mr-3 h-6 w-6 mt-0.5 flex-shrink-0" />
                            <div className="flex-grow">
                                <p className="text-green-800 font-medium">{success}</p>
                                <p className="text-green-600 text-sm mt-1">Redirigiendo a la lista de horarios...</p>
                            </div>
                            <button 
                                onClick={() => setSuccess(null)}
                                className="text-green-500 hover:text-green-700"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 mx-6 mt-6 rounded-md animate-fadeIn flex items-start">
                            <AlertCircle className="text-red-500 mr-3 h-6 w-6 mt-0.5 flex-shrink-0" />
                            <div className="flex-grow">
                                <p className="text-red-800 font-medium">Error</p>
                                <p className="text-red-600">{error}</p>
                            </div>
                            <button 
                                onClick={() => setError(null)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    )}

                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Dia y horarios */}
                            <div className="bg-blue-50 p-4 rounded-lg shadow-inner">
                                <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                                    <Calendar className="h-5 w-5 mr-2 text-blue-700" />
                                    Día y Horario
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="md:col-span-1">
                                        <label htmlFor="diaSemana" className="block text-sm font-medium text-gray-700 mb-1">
                                            Día de la semana <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="diaSemana"
                                                name="diaSemana"
                                                value={horario.diaSemana}
                                                onChange={handleChange}
                                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                                                required
                                            >
                                                <option value="">Seleccione un día</option>
                                                {diasSemana.map(dia => (
                                                    <option key={dia.nombre} value={dia.nombre}>{dia.nombre}</option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <CalendarIcon className="h-5 w-5 text-gray-400" />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="horaInicio" className="block text-sm font-medium text-gray-700 mb-1">
                                            Hora de inicio <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="horaInicio"
                                                type="time"
                                                name="horaInicio"
                                                value={horario.horaInicio}
                                                onChange={handleChange}
                                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                                                required
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <AlarmClock className="h-5 w-5 text-gray-400" />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="horaFin" className="block text-sm font-medium text-gray-700 mb-1">
                                            Hora de fin <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="horaFin"
                                                type="time"
                                                name="horaFin"
                                                value={horario.horaFin}
                                                onChange={handleChange}
                                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                                                required
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <AlarmClockOff className="h-5 w-5 text-gray-400" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Asignaciones */}
                            <div className="bg-blue-50 p-4 rounded-lg shadow-inner">
                                <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                                    <BookOpen className="h-5 w-5 mr-2 text-blue-700" />
                                    Asignaciones
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="idCurso" className="block text-sm font-medium text-gray-700 mb-1">
                                            Curso <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="idCurso"
                                                name="idCurso"
                                                value={horario.idCurso}
                                                onChange={handleChange}
                                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                                                required
                                            >
                                                <option value="0">Seleccione un curso</option>
                                                {cursos.map(curso => (
                                                    <option key={curso.idCurso} value={curso.idCurso}>
                                                        {curso.nombreCurso} - {curso.turno}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <Briefcase className="h-5 w-5 text-gray-400" />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="idDocente" className="block text-sm font-medium text-gray-700 mb-1">
                                            Docente <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="idDocente"
                                                name="idDocente"
                                                value={horario.idDocente}
                                                onChange={handleChange}
                                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                                                required
                                            >
                                                <option value="0">Seleccione un docente</option>
                                                {docentes.map(docente => (
                                                    <option key={docente.idUsuario} value={docente.idUsuario}>
                                                        {docente.nombre} {docente.apellido}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <User className="h-5 w-5 text-gray-400" />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="idMateria" className="block text-sm font-medium text-gray-700 mb-1">
                                            Materia <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="idMateria"
                                                name="idMateria"
                                                value={horario.idMateria}
                                                onChange={handleChange}
                                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                                                required
                                            >
                                                <option value="0">Seleccione una materia</option>
                                                {materias.map(materia => (
                                                    <option key={materia.idMateria} value={materia.idMateria}>
                                                        {materia.nombreMateria}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <BookOpen className="h-5 w-5 text-gray-400" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Botones de acción */}
                            <div className="border-t pt-6 flex justify-between">
                                <button 
                                    type="button" 
                                    className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors duration-300"
                                    onClick={() => navigate(-1)}
                                >
                                    <X className="h-5 w-5 mr-2" />
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    className={`flex items-center ${isSaving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium py-2 px-6 rounded-md transition-colors duration-300`}
                                    disabled={isSaving}
                                >
                                    {isSaving ? (
                                        <Loader2 className="animate-spin h-5 w-5 mr-2" />
                                    ) : (
                                        <Save className="h-5 w-5 mr-2" />
                                    )}
                                    {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                
                {/* Panel de estado actual con información del horario */}
                <div className="mt-6 bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-600">
                    <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wider mb-3">Información del horario actual</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-3 rounded-md">
                            <p className="text-xs text-blue-600 font-medium">Día</p>
                            <p className="font-semibold">{horario.diaSemana || "No asignado"}</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-md">
                            <p className="text-xs text-blue-600 font-medium">Horario</p>
                            <p className="font-semibold">
                                {horario.horaInicio && horario.horaFin ? 
                                    `${horario.horaInicio} - ${horario.horaFin}` : 
                                    "No asignado"}
                            </p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-md">
                            <p className="text-xs text-blue-600 font-medium">Docente</p>
                            <p className="font-semibold">
                                {docentes.find(d => d.idUsuario === horario.idDocente)?.nombre || "No asignado"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditarHorario;