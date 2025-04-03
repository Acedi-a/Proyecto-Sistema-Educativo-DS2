// Primero, necesitamos importar useEffect para las animaciones de carga
import React, { useState, useEffect, useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { appsettings } from '../../settings/appsettings';

const ListarEstudiantes = () => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Estados para búsqueda y filtrado
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'nombre', direction: 'asc' });
    const [filterByCurso, setFilterByCurso] = useState('');
    const [currentView, setCurrentView] = useState('grid'); // 'grid' o 'list'
    
    // Estado para controlar la animación de carga inicial
    const [isVisible, setIsVisible] = useState(false);
    // Para animar las tarjetas una por una
    const [animatedItems, setAnimatedItems] = useState([]);

    useEffect(() => {
        const fetchEstudiantes = async () => {
            try {
                const response = await fetch(`${appsettings.ApiUrl}Estudiante/listar`);
                if (!response.ok) throw new Error('Error al cargar estudiantes');
                
                const data = await response.json();
                console.log('Datos recibidos del API:', data);
                setEstudiantes(data);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
                // Activar animación de entrada después de cargar datos
                setTimeout(() => setIsVisible(true), 100);
            }
        };
        fetchEstudiantes();
    }, []);
 // Aplicar filtros, búsqueda y ordenación
 const filteredAndSortedEstudiantes = useMemo(() => {
    // Primero filtramos por curso si hay alguno seleccionado
    let result = filterByCurso 
        ? estudiantes.filter(e => e.cursoNombre === filterByCurso)
        : estudiantes;
    
    // Luego aplicamos la búsqueda
    if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        result = result.filter(e => 
            e.nombre?.toLowerCase().includes(lowerSearchTerm) ||
            e.nombreUsuario?.toLowerCase().includes(lowerSearchTerm) ||
            e.correo?.toLowerCase().includes(lowerSearchTerm) ||
            e.telefono?.includes(searchTerm) ||
            e.cursoNombre?.toLowerCase().includes(lowerSearchTerm)
        );
    }
    
    // Finalmente ordenamos
    return [...result].sort((a, b) => {
        // Manejamos posibles valores nulos
        if (!a[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (!b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        
        // Ordenamos
        if (a[sortConfig.key].toLowerCase() < b[sortConfig.key].toLowerCase()) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key].toLowerCase() > b[sortConfig.key].toLowerCase()) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });
}, [estudiantes, searchTerm, sortConfig, filterByCurso]);

    // Efecto para animar las tarjetas secuencialmente
    useEffect(() => {
        if (isVisible && filteredAndSortedEstudiantes.length > 0) {
            // Animar cada tarjeta con un pequeño retraso
            const timer = setTimeout(() => {
                filteredAndSortedEstudiantes.forEach((estudiante, index) => {
                    setTimeout(() => {
                        setAnimatedItems(prev => [...prev, estudiante.idUsuario]);
                    }, index * 50); // 50ms de retraso entre cada tarjeta
                });
            }, 200);
            
            return () => clearTimeout(timer);
        }
    }, [isVisible, filteredAndSortedEstudiantes]);

    // Efecto para resetear animaciones al cambiar de vista
    useEffect(() => {
        setAnimatedItems([]);
        setTimeout(() => {
            filteredAndSortedEstudiantes.forEach((estudiante, index) => {
                setTimeout(() => {
                    setAnimatedItems(prev => [...prev, estudiante.idUsuario]);
                }, index * 50);
            });
        }, 100);
    }, [currentView]);

    const getImageUrl = (imagePath) => {
        if (!imagePath) {
            console.log('No hay ruta de imagen');
            return null;
        }
        
        const backendUrl = new URL(appsettings.ApiUrl);
        const imageUrl = `${backendUrl.protocol}//${backendUrl.host}/${imagePath}`;
        
        console.log('URL de imagen generada:', imageUrl);
        return imageUrl;
    };

    // Obtener cursos únicos para el filtro
    const cursos = useMemo(() => {
        const cursosUnicos = [...new Set(estudiantes.map(e => e.cursoNombre))];
        return cursosUnicos.filter(Boolean).sort();
    }, [estudiantes]);
    

    // Función para ordenar estudiantes
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
        
        // Reiniciar animaciones al ordenar
        setAnimatedItems([]);
        setTimeout(() => {
            const sortedData = [...filteredAndSortedEstudiantes];
            sortedData.forEach((estudiante, index) => {
                setTimeout(() => {
                    setAnimatedItems(prev => [...prev, estudiante.idUsuario]);
                }, index * 50);
            });
        }, 100);
    };

   
    // Resetear todos los filtros
    const resetFilters = () => {
        setSearchTerm('');
        setFilterByCurso('');
        setSortConfig({ key: 'nombre', direction: 'asc' });
        
        // Animación para el reset de filtros
        setAnimatedItems([]);
        setTimeout(() => {
            estudiantes.forEach((estudiante, index) => {
                setTimeout(() => {
                    setAnimatedItems(prev => [...prev, estudiante.idUsuario]);
                }, index * 50);
            });
        }, 300);
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
            <div className="animate-pulse flex flex-col items-center">
                <div className="w-16 h-16 border-t-4 border-purple-600 border-solid rounded-full animate-spin"></div>
                <p className="mt-4 text-lg text-purple-800 font-medium">Cargando estudiantes...</p>
                {/* Añadir decoración animada */}
                <div className="flex mt-6 space-x-2">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-3 h-3 bg-indigo-700 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
            </div>
        </div>
    );

    if (error) return (
        <div className="bg-red-100 border-l-4 border-red-600 p-4 m-4 rounded shadow-md animate-fadeIn">
            <div className="flex items-center">
                <svg className="w-6 h-6 text-red-600 mr-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p className="text-red-800 font-bold">Error: {error}</p>
            </div>
        </div>
    );

    return (
        <div className={`bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen p-6 transition-opacity duration-500 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="max-w-7xl mx-auto">
                <div className={`flex justify-between items-center mb-6 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
                    <h2 className="text-3xl font-bold text-indigo-900">Listado de Estudiantes</h2>
                    <NavLink 
                        to="/AgregarEstudiante"
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 flex items-center shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        Agregar Estudiante
                    </NavLink>
                </div>

                {/* Panel de filtros y búsqueda */}
                <div className={`bg-white p-4 rounded-lg shadow-lg mb-6 border border-purple-100 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`} style={{ transitionDelay: '100ms' }}>
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        {/* Buscador */}
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                            <input
                                type="text"
                                className="pl-10 pr-4 py-2 w-full rounded-lg border border-purple-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                placeholder="Buscar por nombre, usuario, correo..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    // Reiniciar animaciones al buscar
                                    setAnimatedItems([]);
                                }}
                            />
                        </div>

                        {/* Filtro por curso */}
                        <div className="min-w-[200px]">
                            <select
                                className="w-full rounded-lg border border-purple-200 py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                value={filterByCurso}
                                onChange={(e) => {
                                    setFilterByCurso(e.target.value);
                                    // Reiniciar animaciones al filtrar
                                    setAnimatedItems([]);
                                }}
                            >
                                <option value="">Todos los cursos</option>
                                {cursos.map(curso => (
                                    <option key={curso} value={curso}>{curso}</option>
                                ))}
                            </select>
                        </div>

                        {/* Botón de reseteo */}
                        <button 
                            onClick={resetFilters}
                            className="bg-gray-100 hover:bg-gray-200 text-indigo-700 py-2 px-4 rounded-lg transition duration-300 flex items-center border border-gray-200 hover:shadow-md transform hover:scale-105"
                        >
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                            </svg>
                            Resetear
                        </button>

                        {/* Cambio de vista */}
                        <div className="flex items-center gap-2 ml-auto">
                            <button
                                onClick={() => setCurrentView('grid')}
                                className={`p-2 rounded-lg transition transform active:scale-90 ${currentView === 'grid' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-purple-50'}`}
                                title="Vista de tarjetas"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                                </svg>
                            </button>
                            <button
                                onClick={() => setCurrentView('list')}
                                className={`p-2 rounded-lg transition transform active:scale-90 ${currentView === 'list' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-purple-50'}`}
                                title="Vista de lista"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Opciones de ordenación */}
                    <div className={`mt-4 flex flex-wrap gap-2 transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '200ms' }}>
                        <span className="text-sm text-gray-600 mr-2 self-center">Ordenar por:</span>
                        {[
                            { key: 'nombre', label: 'Nombre' },
                            { key: 'nombreUsuario', label: 'Usuario' },
                            { key: 'correo', label: 'Correo' },
                            { key: 'cursoNombre', label: 'Curso' }
                        ].map((option, index) => (
                            <button
                                key={option.key}
                                onClick={() => requestSort(option.key)}
                                className={`text-sm px-3 py-1 rounded-full transition transform hover:scale-105 ${
                                    sortConfig.key === option.key 
                                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-purple-50 border border-gray-200'
                                }`}
                                style={{ transitionDelay: `${index * 50}ms` }}
                            >
                                {option.label}
                                {sortConfig.key === option.key && (
                                    <span className="ml-1 inline-block transition-transform duration-300">
                                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Resultados y contador */}
                <div className={`mb-4 text-indigo-700 flex justify-between items-center transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`} style={{ transitionDelay: '300ms' }}>
                    <p>
                        {filteredAndSortedEstudiantes.length === 0 
                            ? 'No se encontraron estudiantes' 
                            : `Mostrando ${filteredAndSortedEstudiantes.length} de ${estudiantes.length} estudiantes`}
                    </p>
                    
                    {(searchTerm || filterByCurso) && (
                        <span className="text-sm bg-indigo-100 text-indigo-700 py-1 px-3 rounded-full border border-indigo-200 animate-pulse">
                            {searchTerm && filterByCurso 
                                ? `Búsqueda: "${searchTerm}" en ${filterByCurso}`
                                : searchTerm 
                                    ? `Búsqueda: "${searchTerm}"`
                                    : `Curso: ${filterByCurso}`}
                        </span>
                    )}
                </div>

                {/* Vista Grid con animaciones */}
                {currentView === 'grid' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAndSortedEstudiantes.map((estudiante, index) => {
                            const imageUrl = getImageUrl(estudiante.imagenPath);
                            const isAnimated = animatedItems.includes(estudiante.idUsuario);
                            
                            return (
                                <div 
                                    key={estudiante.idUsuario}
                                    className={`bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-indigo-500 transition-all duration-500 transform ${isAnimated ? 'opacity-100 translate-y-0 hover:shadow-xl hover:-translate-y-1' : 'opacity-0 translate-y-4'}`}
                                    style={{ transitionDelay: `${index * 50}ms` }}
                                >
                                    <div className="flex flex-col p-6">
                                        <div className="flex items-center mb-4">
                                            {imageUrl ? (
                                                <img 
                                                    src={imageUrl} 
                                                    alt={`${estudiante.nombre}`}
                                                    className="w-16 h-16 rounded-full object-cover border-2 border-indigo-200 mr-4 transform transition-transform duration-300 hover:scale-110"
                                                    onError={(e) => {
                                                        console.error('Error al cargar imagen:', imageUrl);
                                                        e.target.src = 'https://via.placeholder.com/80';
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mr-4 text-indigo-500 transform transition-transform duration-300 hover:scale-110">
                                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                                    </svg>
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="text-xl font-semibold text-indigo-900">{estudiante.nombre}</h3>
                                                <p className="text-sm text-purple-600">{estudiante.nombreUsuario}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2 border-t border-indigo-100 pt-4 text-gray-700">
                                            <p className="flex items-center">
                                                <svg className="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                                </svg>
                                                <span>{estudiante.correo}</span>
                                            </p>
                                            <p className="flex items-center">
                                                <svg className="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                                </svg>
                                                <span>{estudiante.telefono}</span>
                                            </p>
                                            <p className="flex items-center">
                                                <svg className="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                                </svg>
                                                <span className="font-medium text-purple-700">{estudiante.cursoNombre}</span>
                                            </p>
                                        </div>
                                        
                                        <div className="mt-6">
                                            <button 
                                                onClick={() => navigate(`/EditarEstudiante/${estudiante.idUsuario}`)}
                                                className="w-full bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 text-indigo-700 py-2 px-4 rounded-lg flex items-center justify-center transition duration-300 border border-indigo-200 transform hover:scale-105"
                                            >
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                </svg>
                                                Editar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Vista Lista con animaciones */}
                {currentView === 'list' && (
                    <div className={`overflow-x-auto rounded-lg shadow-lg border border-purple-100 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <table className="min-w-full divide-y divide-indigo-100 bg-white">
                            <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                                        Estudiante
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                                        Contacto
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                                        Curso
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-indigo-100">
                                {filteredAndSortedEstudiantes.map((estudiante, index) => {
                                    const imageUrl = getImageUrl(estudiante.imagenPath);
                                    const isAnimated = animatedItems.includes(estudiante.idUsuario);
                                    
                                    return (
                                        <tr key={estudiante.idUsuario} 
                                            className={`hover:bg-indigo-50 transition-all duration-500 ${isAnimated ? 'opacity-100 transform-none' : 'opacity-0 -translate-x-4'}`} 
                                            style={{ transitionDelay: `${index * 30}ms` }}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {imageUrl ? (
                                                        <img
                                                            src={imageUrl}
                                                            alt={`${estudiante.nombre}`}
                                                            className="h-10 w-10 rounded-full mr-3 object-cover border border-indigo-200 transition-transform duration-300 hover:scale-110"
                                                            onError={(e) => {
                                                                e.target.src = 'https://via.placeholder.com/40';
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full mr-3 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center transition-transform duration-300 hover:scale-110">
                                                            <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
</svg>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="text-sm font-medium text-indigo-900">{estudiante.nombre}</div>
                                                        <div className="text-sm text-purple-600">{estudiante.nombreUsuario}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-700">{estudiante.correo}</div>
                                                <div className="text-sm text-gray-600">{estudiante.telefono}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-700">
                                                    {estudiante.cursoNombre}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <button 
                                                    onClick={() => navigate(`/EditarEstudiante/${estudiante.idUsuario}`)}
                                                    className="text-indigo-600 hover:text-indigo-900 transition duration-300 transform hover:scale-110"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Mensaje cuando no hay resultados */}
                {filteredAndSortedEstudiantes.length === 0 && (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center border border-purple-100 animate-fadeIn">
                        <svg className="w-16 h-16 text-indigo-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <h3 className="text-xl font-semibold text-indigo-700 mb-2">No se encontraron estudiantes</h3>
                        <p className="text-gray-600 mb-4">Intenta cambiar los filtros de búsqueda o agregar nuevos estudiantes.</p>
                        <button 
                            onClick={resetFilters}
                            className="inline-flex items-center px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition duration-300"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                            </svg>
                            Resetear filtros
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListarEstudiantes;