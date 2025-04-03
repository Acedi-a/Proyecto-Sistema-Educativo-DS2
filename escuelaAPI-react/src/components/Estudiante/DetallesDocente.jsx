import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaChalkboardTeacher, FaEnvelope, FaPhone, FaBook, FaArrowLeft, FaPaperPlane } from 'react-icons/fa';

const DetallesDocente = () => {
  const { idEstudiante, idDocente } = useParams();
  const [docente, setDocente] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocente = async () => {
      try {
        setCargando(true);
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:7279';
        const response = await fetch(
            `${apiUrl}/Mensaje/obtenerDocenteEspecifico/${idEstudiante}/${idDocente}`,
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setDocente(data);
      } catch (err) {
        setError(err.message);
        console.error('Error al obtener docente:', err);
      } finally {
        setCargando(false);
      }
    };

    fetchDocente();
  }, [idEstudiante, idDocente]);

  if (cargando) return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        <p className="mt-4 text-gray-600 font-medium">Cargando información del docente...</p>
      </div>
  );

  if (error) return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full">
          <div className="bg-red-500 p-4">
            <h2 className="text-white text-lg font-bold">Error al cargar datos</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 p-2 rounded-full">
                <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="ml-3 text-gray-600">{error}</p>
            </div>
            <button
                onClick={() => navigate(-1)}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
            >
              <FaArrowLeft className="mr-2" /> Volver a la lista
            </button>
          </div>
        </div>
      </div>
  );

  if (!docente) return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full">
          <div className="bg-yellow-500 p-4">
            <h2 className="text-white text-lg font-bold">Docente no encontrado</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-yellow-100 p-2 rounded-full">
                <svg className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="ml-3 text-gray-600">El docente solicitado no fue encontrado.</p>
            </div>
            <button
                onClick={() => navigate(-1)}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
            >
              <FaArrowLeft className="mr-2" /> Volver a la lista
            </button>
          </div>
        </div>
      </div>
  );

  return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <button
              onClick={() => navigate(-1)}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors duration-300"
          >
            <FaArrowLeft className="mr-2" /> Volver a la lista
          </button>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header con información principal */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-8 text-white">
              <div className="flex items-center">
                <div className="bg-white p-4 rounded-full mr-6 shadow-md">
                  <FaChalkboardTeacher size={40} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{docente.nombre} {docente.apellido}</h1>
                  <p className="text-blue-100 text-lg mt-1">{docente.especialidad}</p>
                </div>
              </div>
            </div>

            {/* Contenido principal */}
            <div className="p-8">
              {/* Información del docente */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-xl shadow-sm">
                  <h2 className="text-xl font-semibold mb-4 text-blue-800 flex items-center">
                    <FaEnvelope className="mr-2" /> Información de Contacto
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <FaEnvelope className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Correo Electrónico</p>
                        <p className="text-gray-800 font-medium">{docente.correo}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <FaPhone className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Teléfono</p>
                        <p className="text-gray-800 font-medium">{docente.telefono}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-xl shadow-sm">
                  <h2 className="text-xl font-semibold mb-4 text-blue-800 flex items-center">
                    <FaBook className="mr-2" /> Especialidad
                  </h2>
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <FaBook className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Área de especialización</p>
                      <p className="text-gray-800 font-medium">{docente.especialidad}</p>
                    </div>
                  </div>
                </div>
              </div>

             

              {/* Botón de mensaje */}
              <div className="flex justify-center">
                <button
                    onClick={() => navigate(`/estudiante/mensaje/${idEstudiante}/${idDocente}`)}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg shadow-md transition-colors duration-300 flex items-center"
                >
                  <FaPaperPlane className="mr-2" />
                  Enviar Mensaje
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default DetallesDocente;