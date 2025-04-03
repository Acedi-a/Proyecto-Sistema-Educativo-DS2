import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { appsettings } from "../../settings/appsettings";

const EditarEstudiante = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombreUsuario: '',
        nombre: '',
        apellido: '',
        direccion: '',
        telefono: '',
        tutor: '',
        idCurso: '',
        imagen: null,
        imagenActual: ''
    });
    const [cursos, setCursos] = useState([]);
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [imagenPreview, setImagenPreview] = useState(null);
    const [cargandoCursos, setCargandoCursos] = useState(true);
    const [isVisible, setIsVisible] = useState(false); // Para animación de entrada
    const [formSubmitting, setFormSubmitting] = useState(false); // Estado para el botón de envío

    useEffect(() => {
        const fetchData = async () => {
            try {
                setCargandoCursos(true);
                // Obtener cursos
                const cursosRes = await fetch(`${appsettings.ApiUrl}Curso/listar`);
                if (!cursosRes.ok) throw new Error("Error al cargar cursos");
                const cursosData = await cursosRes.json();
                setCursos(cursosData);

                // Obtener datos del estudiante
                const estudianteRes = await fetch(`${appsettings.ApiUrl}Acceso/Obtener/Estudiante/${id}`);
                if (!estudianteRes.ok) throw new Error("Error al cargar datos del estudiante");
                const result = await estudianteRes.json();
                
                // Manejamos ambos formatos de respuesta posibles
                const estudiante = result.estudiante || result;
                
                setFormData({
                    nombreUsuario: estudiante.nombreUsuario || '',
                    nombre: estudiante.nombre || '',
                    apellido: estudiante.apellido || '',
                    direccion: estudiante.direccion || '',
                    telefono: estudiante.telefono || '',
                    tutor: estudiante.tutor || '',
                    idCurso: estudiante.idCurso || '',
                    imagen: null,
                    imagenActual: estudiante.imagenPath || estudiante.ImagenPath || ''
                });

                // Activar animación después de cargar datos
                setTimeout(() => setIsVisible(true), 100);

            } catch (err) {
                console.error("Error al cargar datos:", err);
                setError(err.message || 'Error al cargar datos');
            } finally {
                setCargandoCursos(false);
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFormData(prev => ({
            ...prev,
            imagen: file
        }));
        
        // Crear preview de la imagen
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagenPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje('');
        setError('');
        setFormSubmitting(true);
        
        try {
            const form = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && key !== 'imagenActual') {
                    form.append(key, value);
                }
            });

            const res = await fetch(`${appsettings.ApiUrl}Acceso/Editar/Estudiante/${id}`, {
                method: 'PUT',
                body: form
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Error al actualizar');

            setMensaje(data.message || 'Estudiante actualizado correctamente');
            
            // Mostrar mensaje de éxito y navegar después de un breve retraso
            setTimeout(() => {
                navigate('/listar-estudiante');
            }, 1500);
            
        } catch (err) {
            setError(err.message || 'Error al actualizar estudiante');
            console.error('Error:', err);
        } finally {
            setFormSubmitting(false);
        }
    };

    if (cargandoCursos) return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
            <div className="animate-pulse flex flex-col items-center">
                <div className="w-16 h-16 border-t-4 border-purple-600 border-solid rounded-full animate-spin"></div>
                <p className="mt-4 text-lg text-purple-800 font-medium">Cargando datos del estudiante...</p>
                <div className="flex mt-6 space-x-2">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-3 h-3 bg-indigo-700 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
            </div>
        </div>
    );

    return (
        <div className={`bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen p-6 transition-opacity duration-500 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="max-w-6xl mx-auto">
                <div className={`flex justify-between items-center mb-6 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
                    <h2 className="text-3xl font-bold text-indigo-900">Editar Estudiante</h2>
                    <NavLink 
                        to="/listar-estudiante"
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 flex items-center shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                        </svg>
                        Volver al Listado
                    </NavLink>
                </div>

                {/* Mensajes de éxito o error */}
                {mensaje && (
                    <div className={`bg-green-100 border-l-4 border-green-600 p-4 mb-6 rounded-lg shadow-md animate-fadeIn flex items-center transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
                        <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <p className="text-green-800 font-medium">{mensaje}</p>
                    </div>
                )}

                {error && (
                    <div className={`bg-red-100 border-l-4 border-red-600 p-4 mb-6 rounded-lg shadow-md animate-fadeIn flex items-center transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
                        <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <p className="text-red-800 font-medium">{error}</p>
                    </div>
                )}

                {/* Formulario */}
                <div className={`bg-white rounded-xl shadow-xl overflow-hidden border border-purple-100 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '200ms' }}>
                    <div className="p-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                    <form onSubmit={handleSubmit} className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Primera columna */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-indigo-900 mb-4 flex items-center">
                                    <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                    </svg>
                                    Datos Personales
                                </h3>
                                
                                <div className="relative">
                                    <label htmlFor="nombreUsuario" className="block text-sm font-medium text-indigo-700 mb-1">Nombre de Usuario</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                            </svg>
                                        </div>
                                        <input 
                                            type="text" 
                                            id="nombreUsuario" 
                                            name="nombreUsuario"
                                            value={formData.nombreUsuario}
                                            onChange={handleChange}
                                            required
                                            className="pl-10 block w-full rounded-md border border-purple-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 py-2 transition-colors"
                                            placeholder="Ej: juanperez"
                                        />
                                    </div>
                                </div>
                                
                                <div className="relative">
                                    <label htmlFor="nombre" className="block text-sm font-medium text-indigo-700 mb-1">Nombre</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"></path>
                                            </svg>
                                        </div>
                                        <input 
                                            type="text" 
                                            id="nombre" 
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            required
                                            className="pl-10 block w-full rounded-md border border-purple-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 py-2 transition-colors"
                                            placeholder="Ej: Juan"
                                        />
                                    </div>
                                </div>
                                
                                <div className="relative">
                                    <label htmlFor="apellido" className="block text-sm font-medium text-indigo-700 mb-1">Apellido</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"></path>
                                            </svg>
                                        </div>
                                        <input 
                                            type="text" 
                                            id="apellido" 
                                            name="apellido"
                                            value={formData.apellido}
                                            onChange={handleChange}
                                            required
                                            className="pl-10 block w-full rounded-md border border-purple-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 py-2 transition-colors"
                                            placeholder="Ej: Pérez"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Segunda columna */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-indigo-900 mb-4 flex items-center">
                                    <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    </svg>
                                    Información de Contacto
                                </h3>
                                
                                <div className="relative">
                                    <label htmlFor="direccion" className="block text-sm font-medium text-indigo-700 mb-1">Dirección</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            </svg>
                                        </div>
                                        <input 
                                            type="text" 
                                            id="direccion" 
                                            name="direccion"
                                            value={formData.direccion}
                                            onChange={handleChange}
                                            className="pl-10 block w-full rounded-md border border-purple-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 py-2 transition-colors"
                                            placeholder="Ej: Calle Principal 123"
                                        />
                                    </div>
                                </div>
                                
                                <div className="relative">
                                    <label htmlFor="telefono" className="block text-sm font-medium text-indigo-700 mb-1">Teléfono</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                            </svg>
                                        </div>
                                        <input 
                                            type="text" 
                                            id="telefono" 
                                            name="telefono"
                                            value={formData.telefono}
                                            onChange={handleChange}
                                            className="pl-10 block w-full rounded-md border border-purple-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 py-2 transition-colors"
                                            placeholder="Ej: 555-123-4567"
                                        />
                                    </div>
                                </div>
                                
                                <div className="relative">
                                    <label htmlFor="tutor" className="block text-sm font-medium text-indigo-700 mb-1">Tutor</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                                            </svg>
                                        </div>
                                        <input 
                                            type="text" 
                                            id="tutor" 
                                            name="tutor"
                                            value={formData.tutor}
                                            onChange={handleChange}
                                            className="pl-10 block w-full rounded-md border border-purple-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 py-2 transition-colors"
                                            placeholder="Ej: María Rodríguez"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Fila adicional para curso e imagen */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div className="relative">
                                <label htmlFor="idCurso" className="block text-sm font-medium text-indigo-700 mb-1">Curso</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                        </svg>
                                    </div>
                                    <select
                                        id="idCurso"
                                        name="idCurso"
                                        value={formData.idCurso}
                                        onChange={handleChange}
                                        required
                                        className="pl-10 block w-full rounded-md border border-purple-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 py-2 transition-colors appearance-none"
                                    >
                                        <option value="">Seleccione un curso</option>
                                        {cursos.map(curso => (
                                            <option key={curso.idCurso} value={curso.idCurso}>
                                                {curso.nombreCurso} - {curso.turno}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg className="h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <label htmlFor="imagen" className="block text-sm font-medium text-indigo-700 mb-1">Imagen de Perfil</label>
                                <div className="mt-1 flex items-center space-x-4">
                                    <div className="flex-shrink-0">
                                        {imagenPreview ? (
                                            <img 
                                                src={imagenPreview} 
                                                alt="Vista previa" 
                                                className="h-24 w-24 rounded-full object-cover border-2 border-indigo-200 shadow-md transform transition-transform duration-300 hover:scale-110" 
                                            />
                                        ) : formData.imagenActual ? (
                                            <img 
                                                src={`${appsettings.ApiUrl.replace('/api/', '')}${formData.imagenActual}`}
                                                alt="Imagen actual" 
                                                className="h-24 w-24 rounded-full object-cover border-2 border-indigo-200 shadow-md transform transition-transform duration-300 hover:scale-110" 
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://via.placeholder.com/150?text=Error+cargando+imagen';
                                                }}
                                            />
                                        ) : (
                                            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-500 border-2 border-indigo-200 shadow-md">
                                                <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-grow">
                                        <label htmlFor="imagen" className="cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 px-4 rounded-md shadow hover:shadow-lg transition duration-300 transform hover:scale-105 inline-block">
                                            <span className="flex items-center">
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                </svg>
                                                Cambiar imagen
                                            </span>
                                            <input 
                                                type="file" 
                                                id="imagen" 
                                                name="imagen"
                                                onChange={handleFileChange}
                                                accept="image/*"
                                                className="hidden"
                                            />
                                        </label>
                                        <p className="text-xs text-indigo-500 mt-1">Formatos aceptados: JPG, PNG, GIF</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Botones de acción */}
                        <div className="mt-8 flex justify-center space-x-4">
                            <button
                                type="submit"
                                disabled={formSubmitting}
                                className={`px-8 py-3 text-white font-medium rounded-lg shadow-lg transition-all duration-300 transform ${
                                    formSubmitting 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-105'
                                }`}
                            >
                              {formSubmitting ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Guardando...
                                    </div>
                                ) : (
                                    <span className="flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        Guardar Cambios
                                    </span>
                                )}
                            </button>
                            
                            <button
                                type="button"
                                onClick={() => navigate('/listar-estudiante')}
                                className="px-8 py-3 bg-white text-indigo-700 font-medium rounded-lg shadow-md border border-indigo-200 hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105"
                            >
                                <span className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                    Cancelar
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditarEstudiante;