import React, { useState } from 'react';
import { FaUserGraduate, FaChalkboardTeacher, FaCalendarAlt, FaClipboardList, FaShieldAlt, FaBookOpen, FaLightbulb, FaExclamationCircle } from 'react-icons/fa';

const InicioOperador = () => {
  // Estado para controlar pestañas de guías
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Bienvenido al Panel de Operador</h1>
        <p className="text-gray-600">Sistema Integrado de Gestión Académica</p>
      </div>
      
      {/* Sección de información de rol */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-blue-500">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Rol del Operador</h2>
        <p className="text-gray-700 mb-3">
          Como operador del sistema, usted es responsable de la gestión de información académica crucial para el funcionamiento 
          de la institución. Su rol implica la administración de registros de estudiantes, docentes y horarios académicos.
        </p>
        <p className="text-gray-700 mb-3">
          Esta posición requiere un alto grado de responsabilidad y ética profesional, ya que maneja datos personales 
          y académicos que deben ser tratados con confidencialidad y precisión.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center text-blue-700 mb-2">
              <FaUserGraduate className="mr-2" />
              <h3 className="font-medium">Gestión de Estudiantes</h3>
            </div>
            <p className="text-sm text-gray-600">
              Administre información de estudiantes, matrículas y registros académicos.
            </p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center text-purple-700 mb-2">
              <FaChalkboardTeacher className="mr-2" />
              <h3 className="font-medium">Gestión de Docentes</h3>
            </div>
            <p className="text-sm text-gray-600">
              Administre perfiles docentes, asignaciones y carga académica.
            </p>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center text-yellow-700 mb-2">
              <FaCalendarAlt className="mr-2" />
              <h3 className="font-medium">Gestión de Horarios</h3>
            </div>
            <p className="text-sm text-gray-600">
              Coordine horarios, aulas y recursos para el correcto desarrollo académico.
            </p>
          </div>
        </div>
      </div>
      
      {/* Guías Éticas y Profesionales */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="bg-gray-50 py-4 px-6 border-b border-gray-200">
          <h2 className="font-bold text-gray-800 flex items-center">
            <FaShieldAlt className="mr-2 text-blue-600" />
            Guías Éticas y Profesionales
          </h2>
        </div>
        
        <div className="p-6">
          <div className="flex border-b border-gray-200 mb-4">
            <button 
              className={`px-4 py-2 font-medium ${activeTab === 'general' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('general')}
            >
              Principios Generales
            </button>
            <button 
              className={`px-4 py-2 font-medium ${activeTab === 'datos' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('datos')}
            >
              Manejo de Datos
            </button>
            <button 
              className={`px-4 py-2 font-medium ${activeTab === 'procesos' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('procesos')}
            >
              Procesos Críticos
            </button>
          </div>
          
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div className="flex">
                <div className="text-green-600 mr-3 mt-1">
                  <FaBookOpen />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Integridad y Transparencia</h3>
                  <p className="text-gray-600">
                    Actúe siempre con honestidad y transparencia en todas las operaciones académicas. 
                    Las decisiones y acciones deben ser documentadas adecuadamente para garantizar la trazabilidad 
                    y justificación de cada proceso realizado en el sistema.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="text-green-600 mr-3 mt-1">
                  <FaBookOpen />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Imparcialidad</h3>
                  <p className="text-gray-600">
                    Mantenga un trato equitativo y justo para todos los estudiantes y docentes. 
                    Evite favoritismos o decisiones que puedan beneficiar indebidamente a ciertos individuos 
                    o grupos sobre otros.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="text-green-600 mr-3 mt-1">
                  <FaBookOpen />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Responsabilidad Administrativa</h3>
                  <p className="text-gray-600">
                    Comprenda que sus acciones en el sistema tienen consecuencias directas en la vida académica 
                    de estudiantes y docentes. Asuma la responsabilidad de verificar la exactitud de la información 
                    antes de procesarla o confirmarla.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'datos' && (
            <div className="space-y-4">
              <div className="flex">
                <div className="text-blue-600 mr-3 mt-1">
                  <FaShieldAlt />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Confidencialidad</h3>
                  <p className="text-gray-600">
                    La información personal y académica a la que tiene acceso es confidencial. 
                    No debe compartirse con personas no autorizadas bajo ninguna circunstancia. 
                    Esto incluye datos personales, calificaciones, situaciones disciplinarias y cualquier 
                    información sensible de estudiantes o docentes.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="text-blue-600 mr-3 mt-1">
                  <FaShieldAlt />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Protección de Datos</h3>
                  <p className="text-gray-600">
                    Asegúrese de proteger adecuadamente toda la información manejada en el sistema. 
                    No deje sesiones abiertas sin supervisión, use contraseñas seguras y siga los 
                    protocolos de seguridad establecidos por la institución.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="text-blue-600 mr-3 mt-1">
                  <FaShieldAlt />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Precisión de Registros</h3>
                  <p className="text-gray-600">
                    La exactitud de los datos académicos es fundamental. Verifique cuidadosamente 
                    toda la información antes de procesarla y confirme con las fuentes originales cuando 
                    sea necesario. Los errores pueden tener impactos significativos en la trayectoria 
                    académica de los estudiantes.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'procesos' && (
            <div className="space-y-4">
              <div className="flex">
                <div className="text-red-600 mr-3 mt-1">
                  <FaExclamationCircle />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Matrícula de Estudiantes</h3>
                  <p className="text-gray-600">
                    El proceso de matrícula es crítico y debe seguir estrictamente los procedimientos establecidos. 
                    Verifique que todos los requisitos previos y documentos estén completos. 
                    No proceda con matrículas incompletas o que no cumplan con las normativas institucionales.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="text-red-600 mr-3 mt-1">
                  <FaExclamationCircle />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Asignación de Docentes</h3>
                  <p className="text-gray-600">
                    Asegúrese de que los docentes sean asignados a materias acordes con su especialidad y experiencia. 
                    Verifique la disponibilidad real y carga académica para evitar conflictos o sobrecarga laboral.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="text-red-600 mr-3 mt-1">
                  <FaExclamationCircle />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Gestión de Calificaciones</h3>
                  <p className="text-gray-600">
                    El registro y modificación de calificaciones debe seguir protocolos estrictos. 
                    Cualquier cambio debe estar debidamente autorizado y documentado con las justificaciones 
                    correspondientes. Mantenga un registro de auditoría para todos los cambios realizados.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Sección de Recursos y Documentación */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <FaLightbulb className="mr-2 text-yellow-500" />
          Recursos y Documentación
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <h3 className="font-medium text-gray-800 mb-2">Manual del Operador</h3>
            <p className="text-gray-600 text-sm mb-3">
              Guía completa sobre todas las funcionalidades del sistema y procedimientos operativos.
            </p>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
              Ver documento completo →
            </button>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <h3 className="font-medium text-gray-800 mb-2">Calendario Académico</h3>
            <p className="text-gray-600 text-sm mb-3">
              Fechas importantes, períodos de matrícula, exámenes y eventos académicos.
            </p>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
              Ver calendario →
            </button>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <h3 className="font-medium text-gray-800 mb-2">Reglamentos Institucionales</h3>
            <p className="text-gray-600 text-sm mb-3">
              Normativas académicas, procedimientos administrativos y políticas institucionales.
            </p>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
              Consultar reglamentos →
            </button>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <h3 className="font-medium text-gray-800 mb-2">Mesa de Ayuda</h3>
            <p className="text-gray-600 text-sm mb-3">
              Soporte técnico para resolver problemas o dudas relacionadas con el sistema.
            </p>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
              Solicitar asistencia →
            </button>
          </div>
        </div>
        
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="text-blue-600 mr-3 mt-1">
              <FaLightbulb />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Recordatorio Importante</h3>
              <p className="text-gray-600">
                Recuerde mantener actualizada la información del sistema. Las verificaciones periódicas 
                y la validación de datos son fundamentales para el correcto funcionamiento de los procesos académicos.
                Ante cualquier duda o situación no contemplada en los manuales, consulte con su supervisor antes de proceder.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InicioOperador;