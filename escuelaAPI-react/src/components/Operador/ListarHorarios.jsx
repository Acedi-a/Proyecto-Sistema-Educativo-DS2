import React, { useState, useEffect } from 'react';
import { appsettings } from "../../settings/appsettings";
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { Calendar, Clock, ChevronDown, ChevronUp, Search, User, BookOpen, Briefcase, Plus, Filter } from 'lucide-react';

const ListarHorario = () => {
    const [horarios, setHorarios] = useState([]);
    const [filteredHorarios, setFilteredHorarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filtroDocente, setFiltroDocente] = useState('');
    const [filtroMateria, setFiltroMateria] = useState('');
    const [filtroCurso, setFiltroCurso] = useState('');
    const [activeDay, setActiveDay] = useState('Lunes');

    const diasSemana = [
        { nombre: 'Lunes', icono: <Calendar className="mr-2" /> },
        { nombre: 'Martes', icono: <Calendar className="mr-2" /> },
        { nombre: 'Miércoles', icono: <Calendar className="mr-2" /> },
        { nombre: 'Jueves', icono: <Calendar className="mr-2" /> },
        { nombre: 'Viernes', icono: <Calendar className="mr-2" /> }
    ];

    const navigate = useNavigate();

    useEffect(() => {
        fetchHorarios();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [horarios, searchTerm, filtroDocente, filtroMateria, filtroCurso]);

    const fetchHorarios = async () => {
        try {
            const response = await fetch(`${appsettings.ApiUrl}Horario/listarHorarios`);
            const data = await response.json();
            setHorarios(data);
            setFilteredHorarios(data);
        } catch (error) {
            console.error('Error fetching horarios:', error);
        }
    };

    const applyFilters = () => {
        let result = [...horarios];
        
        if (searchTerm) {
            result = result.filter(h => 
                h.docente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                h.materia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                h.curso?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        if (filtroDocente) {
            result = result.filter(h => h.docente?.toLowerCase().includes(filtroDocente.toLowerCase()));
        }
        
        if (filtroMateria) {
            result = result.filter(h => h.materia?.toLowerCase().includes(filtroMateria.toLowerCase()));
        }
        
        if (filtroCurso) {
            result = result.filter(h => h.curso?.toLowerCase().includes(filtroCurso.toLowerCase()));
        }
        
        setFilteredHorarios(result);
    };

    const handleEdit = (idHorario) => {
        navigate(`/EditarHorarios/${idHorario}`);
    };

    const resetFilters = () => {
        setSearchTerm('');
        setFiltroDocente('');
        setFiltroMateria('');
        setFiltroCurso('');
    };

    const getUniqueValues = (key) => {
        return [...new Set(horarios.map(h => h[key]))].filter(Boolean);
    };

    const HorarioCard = ({ horario }) => (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-all duration-300 border-l-4 border-blue-500">
            <div className="flex flex-col gap-2">
                <div className="flex items-center text-blue-700">
                    <Clock size={16} className="mr-2" />
                    <span className="font-medium">{horario.horaInicio} - {horario.horaFin}</span>
                </div>
                <div className="flex items-center">
                    <User size={16} className="mr-2 text-blue-600" />
                    <span><strong>Docente:</strong> {horario.docente}</span>
                </div>
                <div className="flex items-center">
                    <BookOpen size={16} className="mr-2 text-blue-600" />
                    <span><strong>Materia:</strong> {horario.materia}</span>
                </div>
                <div className="flex items-center">
                    <Briefcase size={16} className="mr-2 text-blue-600" />
                    <span><strong>Curso:</strong> {horario.curso}</span>
                </div>
                <button 
                    className="mt-3 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center"
                    onClick={() => handleEdit(horario.idHorario)}
                >
                    Editar
                </button>
            </div>
        </div>
    );

    return (
        <div className="bg-blue-50 min-h-screen p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold text-blue-800">Horarios Semanales</h1>
                        <NavLink 
                            to="/DesignarHorarios"
                            className="bg-blue-600 text-white py-2 px-4 rounded flex items-center hover:bg-blue-700 transition-colors duration-300 mt-3 md:mt-0"
                        >
                            <Plus size={18} className="mr-2" />
                            Designar Horarios
                        </NavLink>
                    </div>
                    
                    {/* Search and filters */}
                    <div>
                        <div className="flex flex-col md:flex-row gap-3 mb-3">
                            <div className="relative flex-grow">
                                <input
                                    type="text"
                                    placeholder="Buscar por docente, materia, curso..."
                                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Search size={18} className="absolute right-3 top-2.5 text-gray-400" />
                            </div>
                            <button 
                                className="bg-blue-100 text-blue-800 px-4 py-2 rounded-md hover:bg-blue-200 transition-colors duration-300 flex items-center justify-center"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <Filter size={18} className="mr-2" />
                                Filtros avanzados
                                {showFilters ? <ChevronUp size={18} className="ml-2" /> : <ChevronDown size={18} className="ml-2" />}
                            </button>
                        </div>
                        
                        {showFilters && (
                            <div className="bg-blue-50 p-4 rounded-md mb-4 animate-fadeIn">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Docente</label>
                                        <select 
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={filtroDocente}
                                            onChange={(e) => setFiltroDocente(e.target.value)}
                                        >
                                            <option value="">Todos los docentes</option>
                                            {getUniqueValues('docente').map(docente => (
                                                <option key={docente} value={docente}>{docente}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Materia</label>
                                        <select 
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={filtroMateria}
                                            onChange={(e) => setFiltroMateria(e.target.value)}
                                        >
                                            <option value="">Todas las materias</option>
                                            {getUniqueValues('materia').map(materia => (
                                                <option key={materia} value={materia}>{materia}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Curso</label>
                                        <select 
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={filtroCurso}
                                            onChange={(e) => setFiltroCurso(e.target.value)}
                                        >
                                            <option value="">Todos los cursos</option>
                                            {getUniqueValues('curso').map(curso => (
                                                <option key={curso} value={curso}>{curso}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-end mt-4">
                                    <button 
                                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-colors duration-300"
                                        onClick={resetFilters}
                                    >
                                        Limpiar filtros
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Tabs for days */}
                <div className="flex overflow-x-auto mb-6 bg-white rounded-lg shadow-md p-1">
                    {diasSemana.map((dia) => (
                        <button
                            key={dia.nombre}
                            className={`flex-1 min-w-max py-3 px-4 text-center transition-all duration-300 rounded-md flex items-center justify-center
                                ${activeDay === dia.nombre 
                                    ? 'bg-blue-600 text-white font-medium' 
                                    : 'hover:bg-blue-100 text-blue-800'}`}
                            onClick={() => setActiveDay(dia.nombre)}
                        >
                            {dia.icono}
                            {dia.nombre}
                        </button>
                    ))}
                </div>
                
                {/* Content */}
                <div className="bg-white rounded-lg shadow-md p-6 animate-fadeIn">
                    <h2 className="text-xl font-bold text-blue-800 border-b-2 border-blue-200 pb-2 mb-4 flex items-center">
                        {diasSemana.find(d => d.nombre === activeDay)?.icono}
                        Horarios para {activeDay}
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredHorarios
                            .filter(horario => horario.diaSemana === activeDay)
                            .map(horario => (
                                <HorarioCard key={horario.idHorario} horario={horario} />
                            ))}
                        
                        {filteredHorarios.filter(horario => horario.diaSemana === activeDay).length === 0 && (
                            <div className="col-span-full py-8 text-center text-gray-500">
                                No hay horarios registrados para este día
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListarHorario;