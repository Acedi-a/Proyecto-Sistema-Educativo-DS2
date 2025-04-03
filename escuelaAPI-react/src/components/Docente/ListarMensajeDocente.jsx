import React,{ useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaExpand, FaCompress, FaCalendarCheck, FaCalendarTimes, FaUserGraduate } from 'react-icons/fa';
import { useAuth } from '../Auth/AuthContext';

const ListarMensajeDocente = () => {
  const {user}=useAuth();
  const { idDocente } = useParams();
  const [mensajes, setMensajes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [respuestaReunion, setRespuestaReunion] = useState({});
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [respondiendoA, setRespondiendoA] = useState(null);

  // Obtener mensajes del docente
  useEffect(() => {
    const fetchMensajes = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:7279';
        const response = await fetch(`${apiUrl}/Mensaje/docente/${user.id}`);

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${await response.text()}`);
        }
        
        const data = await response.json();
        
        // Normalizar datos
        const mensajesNormalizados = Array.isArray(data) ? data.map(m => ({
            ...m,
            idMensaje: m.idMensaje || m.IdMensaje,
            asunto: m.asunto || m.Asunto || 'Sin asunto',
            contenidoMensaje: m.contenidoMensaje || m.ContenidoMensaje || '',
            reunion: m.reunion || m.Reunion || false,
            estado: m.estado || m.Estado,
            fechaCreacion: m.fechaCreacion || m.FechaCreacion,
            estudiante: {
              ...(m.estudiante || m.Estudiante || {}),
              nombreCompleto: m.estudiante?.nombreCompleto || m.Estudiante?.nombreCompleto || 'Estudiante no disponible',
              curso: m.estudiante?.curso || m.Estudiante?.curso || 'Curso no disponible'  
            }
          })) : [];
          
        
        setMensajes(mensajesNormalizados);
      } catch (err) {
        console.error('Error al obtener mensajes:', err);
        setError(err.message);
        setMensajes([]);
      } finally {
        setCargando(false);
      }
    };

    fetchMensajes();
  }, [idDocente]);

  // Responder a reunión
  const handleResponderReunion = async (idMensaje, aceptada) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:7279';
      const response = await fetch(`${apiUrl}/Mensaje/reunion/${idMensaje}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Aceptada: aceptada })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();

      // Actualizar estado local
      setMensajes(prev => prev.map(m => 
        m.idMensaje === idMensaje ? { ...m, estado: aceptada } : m
      ));

      setRespuestaReunion(prev => ({
        ...prev,
        [idMensaje]: { success: true, message: data.message || (aceptada ? 'Reunión aceptada' : 'Reunión rechazada') }
      }));

      // Limpiar mensaje después de 3 segundos
      setTimeout(() => {
        setRespuestaReunion(prev => {
          const newState = { ...prev };
          delete newState[idMensaje];
          return newState;
        });
      }, 3000);

    } catch (err) {
      setRespuestaReunion(prev => ({
        ...prev,
        [idMensaje]: { success: false, message: err.message }
      }));
    }
  };

  // Enviar respuesta a mensaje
  const handleEnviarRespuesta = async (idMensajeOriginal) => {
    if (!nuevoMensaje.trim()) {
      setError('El mensaje no puede estar vacío');
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:7279';
      const response = await fetch(`${apiUrl}/Mensaje/${idDocente}/${idMensajeOriginal}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ContenidoMensaje: nuevoMensaje,
          Reunion: false
        })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      
      // Actualizar lista de mensajes
      setMensajes(prev => [...prev, {
        idMensaje: data.idMensaje,
        asunto: `Re: ${mensajes.find(m => m.idMensaje === idMensajeOriginal)?.asunto || ''}`,
        contenidoMensaje: nuevoMensaje,
        fechaCreacion: new Date().toISOString(),
        estudiante: null, // Este mensaje lo envía el docente
        docente: { nombreCompleto: 'Yo' }
      }]);

      setNuevoMensaje('');
      setRespondiendoA(null);
      
    } catch (err) {
      setError(err.message);
    }
  };

  // Alternar expansión de mensaje
  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (cargando) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Recargar</button>
      </div>
    );
  }

  return (
    <div className="mensajes-container">
      <h1>Mensajes Recibidos</h1>

      {mensajes.length === 0 ? (
        <div className="no-messages">
          No hay mensajes para mostrar.
        </div>
      ) : (
        <div className="messages-list">
          {mensajes.map((mensaje) => (
            <div 
              key={mensaje.idMensaje} 
              className={`message-card ${mensaje.reunion ? 'reunion' : ''}`}
            >
              <div className="message-header">
                <div>
                  <h2>{mensaje.asunto}</h2>
                  {mensaje.estudiante && (
                    <div className="student-info">
                      <FaUserGraduate />
                      <span>
                        {mensaje.estudiante.nombreCompleto} - {mensaje.estudiante.curso}
                      </span>
                    </div>
                  )}
                  <div className="message-date">
                    {new Date(mensaje.fechaCreacion).toLocaleString()}
                  </div>
                </div>
                
                {mensaje.contenidoMensaje && (
                  <button
                    onClick={() => toggleExpand(mensaje.idMensaje)}
                    className="expand-button"
                  >
                    {expandedId === mensaje.idMensaje ? <FaCompress /> : <FaExpand />}
                  </button>
                )}
              </div>

              {(expandedId === mensaje.idMensaje || (mensaje.contenidoMensaje && mensaje.contenidoMensaje.length < 150)) && (
                <div className="message-content">
                  <p>{mensaje.contenidoMensaje}</p>
                </div>
              )}

              {mensaje.reunion && (
                <div className="reunion-section">
                  <div className="reunion-header">
                    <FaCalendarCheck />
                    <span>Solicitud de Reunión</span>
                    {mensaje.estado !== null && (
                      <span className={`status-badge ${mensaje.estado ? 'accepted' : 'rejected'}`}>
                        {mensaje.estado ? 'Aceptada' : ''}
                      </span>
                    )}
                  </div>

                  {mensaje.reunion  && (
                    <div className="reunion-actions">
                      <button
                        onClick={() => handleResponderReunion(mensaje.idMensaje, true)}
                        className="accept-button"
                      >
                        <FaCalendarCheck /> Aceptar
                      </button>
                      <button
                        onClick={() => handleResponderReunion(mensaje.idMensaje, false)}
                        className="reject-button"
                      >
                        <FaCalendarTimes /> Rechazar
                      </button>
                    </div>
                  )}
                </div>
              )}

              {respondiendoA === mensaje.idMensaje && (
                <div className="reply-form">
                  <textarea
                    value={nuevoMensaje}
                    onChange={(e) => setNuevoMensaje(e.target.value)}
                    placeholder="Escribe tu respuesta..."
                  />
                  <div className="form-actions">
                    <button
                      onClick={() => setRespondiendoA(null)}
                      className="cancel-button"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleEnviarRespuesta(mensaje.idMensaje)}
                      className="send-button"
                    >
                      Enviar
                    </button>
                  </div>
                </div>
              )}

              {respuestaReunion[mensaje.idMensaje] && (
                <div className={`response-message ${respuestaReunion[mensaje.idMensaje].success ? 'success' : 'error'}`}>
                  {respuestaReunion[mensaje.idMensaje].message}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <style>{`
        .mensajes-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        h1 {
          color: #2c3e50;
          margin-bottom: 30px;
          text-align: center;
        }
        
        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
        }
        
        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 5px solid #f3f3f3;
          border-top: 5px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .error-container {
          background-color: #fee;
          border-left: 4px solid #e74c3c;
          padding: 15px;
          margin: 20px 0;
          color: #c0392b;
        }
        
        .error-container button {
          background-color: #e74c3c;
          color: white;
          border: none;
          padding: 8px 15px;
          margin-top: 10px;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .no-messages {
          text-align: center;
          padding: 30px;
          background-color: #f8f9fa;
          border-radius: 8px;
          color: #7f8c8d;
        }
        
        .messages-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .message-card {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .message-card.reunion {
          border-left: 4px solid #3498db;
        }
        
        .message-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 15px;
          background-color: #f8f9fa;
          border-bottom: 1px solid #eee;
        }
        
        .message-header h2 {
          margin: 0;
          color: #2c3e50;
          font-size: 1.2rem;
        }
        
        .student-info {
          display: flex;
          align-items: center;
          margin-top: 5px;
          color: #7f8c8d;
          font-size: 0.9rem;
        }
        
        .student-info svg {
          margin-right: 5px;
        }
        
        .message-date {
          font-size: 0.8rem;
          color: #95a5a6;
          margin-top: 5px;
        }
        
        .expand-button {
          background: none;
          border: none;
          color: #3498db;
          cursor: pointer;
          font-size: 1rem;
        }
        
        .message-content {
          padding: 15px;
          color: #34495e;
          line-height: 1.6;
        }
        
        .reunion-section {
          padding: 15px;
          background-color: #f0f7fd;
          border-top: 1px solid #d6eaf8;
        }
        
        .reunion-header {
          display: flex;
          align-items: center;
          color: #2980b9;
          margin-bottom: 10px;
        }
        
        .reunion-header svg {
          margin-right: 8px;
        }
        
        .status-badge {
          margin-left: 10px;
          padding: 3px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: bold;
        }
        
        .status-badge.accepted {
          background-color: #d4edda;
          color: #155724;
        }
        
        .status-badge.rejected {
          background-color: #f8d7da;
          color: #721c24;
          display: none;
        }
        
        .reunion-actions {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }
        
        .accept-button, .reject-button {
          display: flex;
          align-items: center;
          padding: 8px 15px;
          border: none;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
        }
        
        .accept-button {
          background-color: #28a745;
          color: white;
        }
        
        .reject-button {
          background-color: #dc3545;
          color: white;
        }
        
        .accept-button svg, .reject-button svg {
          margin-right: 5px;
        }
        
        .message-actions {
          padding: 10px 15px;
          border-top: 1px solid #eee;
          display: flex;
          justify-content: flex-end;
        }
        
        .reply-form {
          padding: 15px;
          border-top: 1px solid #eee;
        }
        
        .reply-form textarea {
          width: 100%;
          min-height: 100px;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          resize: vertical;
          margin-bottom: 10px;
          font-family: inherit;
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
        
        .cancel-button, .send-button {
          padding: 8px 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .cancel-button {
          background-color: #6c757d;
          color: white;
        }
        
        .send-button {
          background-color: #007bff;
          color: white;
        }
        
        .response-message {
          padding: 10px 15px;
          margin: 0 15px 15px;
          border-radius: 4px;
          font-size: 0.9rem;
        }
        
        .response-message.success {
          background-color: #d4edda;
          color: #155724;
        }
        
        .response-message.error {
          background-color: #f8d7da;
          color: #721c24;
        }
      `}</style>
    </div>
  );
};

export default ListarMensajeDocente;