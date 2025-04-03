import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaUserGraduate, FaChalkboardTeacher, FaCalendarCheck, FaReply, FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const HistorialMensaje = () => {
  const { idEstudiante } = useParams();
  const [mensajes, setMensajes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [expandidos, setExpandidos] = useState({});
  const [filtro, setFiltro] = useState('todos');

  // Toggle para expandir/contraer mensajes
  const toggleExpandir = (id) => {
    setExpandidos(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Obtener historial de mensajes del estudiante
  useEffect(() => {
    const fetchHistorial = async () => {
      setCargando(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:7279';
        const response = await fetch(`${apiUrl}/Mensaje/estudiante/${idEstudiante}`);

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${await response.text()}`);
        }

        const data = await response.json();

        // Normalizar datos
        const mensajesNormalizados = Array.isArray(data) ? data.map(m => ({
          idMensaje: m.idMensaje || m.IdMensaje,
          asunto: m.asunto || m.Asunto || 'Sin asunto',
          contenidoMensaje: m.contenidoMensaje || m.ContenidoMensaje || '',
          reunion: m.reunion || m.Reunion || false,
          estado: m.estado ?? m.Estado ?? null,
          fechaCreacion: m.fechaCreacion || m.FechaCreacion || new Date().toISOString(),
          docente: {
            id: m.docente?.id || m.Docente?.id,
            nombreCompleto: m.docente?.nombreCompleto ||
                m.Docente?.NombreCompleto ||
                `${m.docente?.nombre || m.Docente?.nombre || ''} ${m.docente?.apellido || m.Docente?.apellido || ''}`.trim() ||
                'Docente no disponible',
            especialidad: m.docente?.especialidad || m.Docente?.especialidad || 'Sin especialidad'
          }
        })) : [];

        setMensajes(mensajesNormalizados);
      } catch (err) {
        console.error('Error al obtener historial:', err);
        setError(err.message);
        setMensajes([]);
      } finally {
        setCargando(false);
      }
    };

    fetchHistorial();
  }, [idEstudiante]);

  // Filtrar mensajes
  const mensajesFiltrados = mensajes.filter(mensaje => {
    if (filtro === 'todos') return true;
    if (filtro === 'reuniones') return mensaje.reunion;
    if (filtro === 'mensajes') return !mensaje.reunion;
    return true;
  });

  // Formatea la fecha en un formato más amigable
  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    const hoy = new Date();
    const ayer = new Date(hoy);
    ayer.setDate(ayer.getDate() - 1);

    const esHoy = fecha.toDateString() === hoy.toDateString();
    const esAyer = fecha.toDateString() === ayer.toDateString();

    const opciones = { hour: '2-digit', minute: '2-digit' };
    const hora = fecha.toLocaleTimeString(undefined, opciones);

    if (esHoy) {
      return `Hoy a las ${hora}`;
    } else if (esAyer) {
      return `Ayer a las ${hora}`;
    } else {
      return `${fecha.toLocaleDateString()} ${hora}`;
    }
  };

  if (cargando) {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
          <div className="relative">
            <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            <div className="w-16 h-16 border-r-4 border-transparent border-solid rounded-full absolute top-0 animate-ping"></div>
          </div>
          <p className="ml-4 text-lg font-medium text-gray-700">Cargando mensajes...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className="max-w-4xl mx-auto p-6 mt-10">
          <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaTimesCircle className="h-8 w-8 text-red-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-red-800">Ocurrió un error</h3>
                <p className="mt-2 text-red-700">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-3 inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 text-white rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
              <h1 className="text-3xl font-bold text-white tracking-tight">Historial de Mensajes</h1>
              <p className="text-blue-100 mt-1">Consulta y gestiona tus comunicaciones</p>

              {/* Filtros */}
              <div className="mt-6 flex space-x-2">
                <button
                    onClick={() => setFiltro('todos')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        filtro === 'todos'
                            ? 'bg-white text-blue-700 shadow-md'
                            : 'bg-blue-800 text-blue-200 hover:bg-blue-700'
                    }`}
                >
                  Todos
                </button>
                <button
                    onClick={() => setFiltro('mensajes')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        filtro === 'mensajes'
                            ? 'bg-white text-blue-700 shadow-md'
                            : 'bg-blue-800 text-blue-200 hover:bg-blue-700'
                    }`}
                >
                  Mensajes
                </button>
                <button
                    onClick={() => setFiltro('reuniones')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        filtro === 'reuniones'
                            ? 'bg-white text-blue-700 shadow-md'
                            : 'bg-blue-800 text-blue-200 hover:bg-blue-700'
                    }`}
                >
                  Reuniones
                </button>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-6">
              {mensajesFiltrados.length === 0 ? (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 text-center">
                    <div className="inline-flex h-14 w-14 rounded-full bg-blue-100 p-3 text-blue-600 mb-4">
                      <FaUserGraduate className="h-8 w-8" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">No hay mensajes</h2>
                    <p className="text-gray-600">
                      {filtro === 'todos' ? 'No tienes mensajes en tu historial.' :
                          filtro === 'reuniones' ? 'No tienes solicitudes de reunión.' :
                              'No tienes mensajes regulares.'}
                    </p>
                  </div>
              ) : (
                  <div className="space-y-6">
                    {mensajesFiltrados.map((mensaje) => {
                      const expandido = expandidos[mensaje.idMensaje] || false;

                      return (
                          <div
                              key={mensaje.idMensaje}
                              className={`bg-white rounded-xl overflow-hidden transition-all duration-300 group hover:shadow-lg ${
                                  expandido ? 'shadow-lg ring-2 ring-blue-200' : 'shadow-md'
                              } ${mensaje.reunion ? 'border-l-4 border-blue-500' : ''}`}
                          >
                            {/* Cabecera del mensaje */}
                            <div
                                className={`px-6 py-4 cursor-pointer transition-colors ${
                                    mensaje.reunion ? 'bg-gradient-to-r from-blue-50 to-indigo-50' : 'bg-gray-50'
                                } hover:bg-opacity-80`}
                                onClick={() => toggleExpandir(mensaje.idMensaje)}
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex-grow">
                                  <div className="flex items-center">
                                    <h2 className="text-lg font-bold text-gray-800 mr-3">{mensaje.asunto}</h2>
                                    {mensaje.reunion && (
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            mensaje.estado === null ? 'bg-yellow-100 text-yellow-800' :
                                                mensaje.estado ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                  {mensaje.estado === null ? 'Pendiente' :
                                      mensaje.estado ? 'Aceptada' : 'Sin confirmar'}
                                </span>
                                    )}
                                  </div>

                                  <div className="flex flex-col sm:flex-row sm:items-center mt-1">
                                    <div className="flex items-center text-sm text-gray-600">
                                      <FaChalkboardTeacher className="mr-1 text-blue-600" />
                                      <span className="font-medium">
                                  {mensaje.docente.nombreCompleto}
                                </span>
                                      <span className="mx-2 text-gray-400 hidden sm:inline">•</span>
                                    </div>
                                    <span className="text-xs text-gray-500">{mensaje.docente.especialidad}</span>
                                  </div>

                                  <div className="text-xs text-gray-500 mt-1">
                                    {formatearFecha(mensaje.fechaCreacion)}
                                  </div>
                                </div>

                                <div className="ml-4">
                                  {expandido ? (
                                      <FaEyeSlash className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                                  ) : (
                                      <FaEye className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Contenido del mensaje (expandible) */}
                            <div
                                className={`transition-all duration-300 overflow-hidden ${
                                    expandido ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                }`}
                            >
                              <div className="px-6 py-4 border-t border-gray-100">
                                <div className="prose prose-blue max-w-none">
                                  <p className="whitespace-pre-line">{mensaje.contenidoMensaje}</p>
                                </div>
                              </div>

                              {/* Sección de reunión */}
                              {mensaje.reunion && (
                                  <div className="px-6 py-4 bg-blue-50 border-t border-blue-100">
                                    <div className="flex items-center">
                                      <FaCalendarCheck className="text-blue-600 mr-2" />
                                      <span className="font-medium text-blue-700">Solicitud de Reunión</span>
                                      {mensaje.estado !== null && (
                                          <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                              mensaje.estado
                                                  ? 'bg-green-100 text-green-800'
                                                  : 'bg-gray-100 text-gray-800'
                                          }`}>
                                  {mensaje.estado ? (
                                      <>
                                        <FaCheckCircle className="mr-1" />
                                        Aceptada
                                      </>
                                  ) : (
                                      'Sin confirmar'
                                  )}
                                </span>
                                      )}
                                    </div>

                                    {mensaje.estado === null && (
                                        <div className="mt-4 flex space-x-3">
                                          <button className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition duration-300">
                                            <FaCheckCircle className="mr-2" />
                                            Aceptar
                                          </button>
                                          <button className="inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-md transition duration-300">
                                            <FaTimesCircle className="mr-2" />
                                            Rechazar
                                          </button>
                                        </div>
                                    )}
                                  </div>
                              )}

                              {/* Acciones */}
                              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
                                <button className="inline-flex items-center px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm font-medium rounded-md transition duration-300">
                                  <FaReply className="mr-1" />
                                  Responder
                                </button>
                              </div>
                            </div>
                          </div>
                      );
                    })}
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default HistorialMensaje;