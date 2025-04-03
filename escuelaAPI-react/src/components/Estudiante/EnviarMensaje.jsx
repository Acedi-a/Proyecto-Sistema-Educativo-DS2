import React,{ useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPaperPlane, FaCalendarAlt, FaTimes } from 'react-icons/fa';

const EnviarMensaje = () => {
  const { idEstudiante, idDocente } = useParams();
  const navigate = useNavigate();
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    Asunto: '',
    ContenidoMensaje: '',
    Reunion: false,
    FechaReunion: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Enviar el mensaje
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:7279';
      
      // Crear FormData para enviar como multipart/form-data
      const formDataToSend = new FormData();
      formDataToSend.append('Asunto', formData.Asunto);
      formDataToSend.append('ContenidoMensaje', formData.ContenidoMensaje);
      formDataToSend.append('Reunion', formData.Reunion.toString());
      if (formData.Reunion && formData.FechaReunion) {
        formDataToSend.append('FechaReunion', formData.FechaReunion);
      }

      const response = await fetch(
        `${apiUrl}/Mensaje/${idEstudiante}/${idDocente}`,
        {
          method: 'POST',
          body: formDataToSend
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al enviar el mensaje');
      }

      setSuccess({
        message: data.message,
        idMensaje: data.idMensaje
      });
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Enviar Mensaje al Docente</h1>
          <button 
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p>{error}</p>
          </div>
        )}

        {success ? (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
            <p className="font-bold">{success.message}</p>
            <p>ID del mensaje: {success.idMensaje}</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
            >
              Volver
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="Asunto" className="block text-gray-700 font-medium mb-2">
                Asunto
              </label>
              <input
                type="text"
                id="Asunto"
                name="Asunto"
                value={formData.Asunto}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="ContenidoMensaje" className="block text-gray-700 font-medium mb-2">
                Mensaje
              </label>
              <textarea
                id="ContenidoMensaje"
                name="ContenidoMensaje"
                value={formData.ContenidoMensaje}
                onChange={handleChange}
                rows="6"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="Reunion"
                  checked={formData.Reunion}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-gray-700 font-medium">
                  <FaCalendarAlt className="inline mr-1" />
                  Solicitar reunión
                </span>
              </label>
            </div>

            

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="mr-2" />
                    Enviar Mensaje
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EnviarMensaje;