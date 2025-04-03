
//PARTE DE OPERADOR
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import EncabezadoOperador from "./components/Operador/EncabezadorOperador";
import AgregarDocente from "./components/Operador/AgregarDocente";
import EditarDocente from "./components/Operador/EditarDocentes";
import InicioOperador from "./components/Operador/InicioOperador";
import ListarDocente from "./components/Operador/ListarDocente";
import DesignarHorarios from "./components/Operador/DesignarHorarios";
import EditarHorario from "./components/Operador/EditarHorario";
import ListarHorarios from "./components/Operador/ListarHorarios";
import AgregarEstudiante from "./components/Operador/AgregarEstudiante";
import EditarEstudiante from "./components/Operador/EditarEstudiante";
import ListarEstudiante from "./components/Operador/ListarEstudiante";



//PARTE DE ESTUDIANTE 


import { Navbar } from "./components/Estudiante/Navbar.jsx";
import {EstudianteView} from "./components/Estudiante/EstudianteView.jsx";
import {EstudianteCalificacionCompleto} from "./components/Estudiante/EstudianteCalificacionCompleto.jsx";
import {EstudianteHorarioCompleto} from "./components/Estudiante/EstudianteHorarioCompleto.jsx";
import { EstudianteAsistenciaCompleto } from "./components/Estudiante/EstudianteAsistenciaCompleto.jsx";
import {EstudiantePagosCompleto} from "./components/Estudiante/EstudiantePagosCompleto.jsx";
import {EstudianteExamenesCompleto} from "./components/Estudiante/EstudianteExamenesCompleto.jsx";
import { AuthProvider } from "./components/Auth/AuthContext.jsx";
import Login from "./components/Auth/Login.jsx";
import ProtectedRoute from "./components/Auth/ProtectedRoute.jsx";
import ListarDocentesPorEstudiante from "./components/Estudiante/ListarDocentesPorEstudiante.jsx";
import DetallesDocente from "./components/Estudiante/DetallesDocente.jsx";
import EnviarMensaje from "./components/Estudiante/EnviarMensaje.jsx";
import HistorialMensaje from "./components/Estudiante/HistorialMensajes.jsx";
import { DocenteNavbar } from "./components/Docente/DocenteNavbar.jsx";
import { DocenteCalificacion } from "./components/Docente/DocenteCalificacion.jsx";
import { ListarMisEstudiantes } from "./components/Docente/ListarEstudiante.jsx";
import { GenerarCalificion } from "./components/Docente/GenerarBoletin.jsx";
import ListarMensajeDocente from "./components/Docente/ListarMensajeDocente.jsx";



const OperadorLayout = () => {
  return (
    <>
      <EncabezadoOperador />
      <Routes>
        <Route path="/inicioOperador/:id" element={<InicioOperador />} />
        <Route path="/EditarDocente/:id" element={<EditarDocente />} />
        <Route path="/AgregarDocente" element={<AgregarDocente/>} />
        <Route path="/listar-docentes" element={<ListarDocente/>} />
        <Route path="/DesignarHorarios" element={<DesignarHorarios/>} />
        <Route path="/EditarHorarios/:idHorario" element={<EditarHorario/>} />
        <Route path="/ListarHorarios" element={<ListarHorarios/>} />
        <Route path="/AgregarEstudiante" element={<AgregarEstudiante/>} />
        <Route path="/EditarEstudiante/:id" element={<EditarEstudiante/>} />
        <Route path="/listar-estudiante" element={<ListarEstudiante/>} />
      </Routes>
    </>
  );
};

const EstudianteLayout = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path=":id" element={<EstudianteView />} />
        <Route path="calificacion" element={<EstudianteCalificacionCompleto/>} />
        <Route path="horario" element={<EstudianteHorarioCompleto/>} />
        <Route path="asistencia" element={<EstudianteAsistenciaCompleto/>} />
        <Route path="pago" element={<EstudiantePagosCompleto/>} />
        <Route path="examen" element={<EstudianteExamenesCompleto/>} />
          <Route path="listar/:id" element={<ListarDocentesPorEstudiante />} />
          <Route path="docente/:idEstudiante/:idDocente" element={<DetallesDocente />} />
          <Route path='mensaje/:idEstudiante/:idDocente' element={<EnviarMensaje />} />
          <Route path='historial/mensaje/:idEstudiante' element={<HistorialMensaje/>} />
      </Routes>
    </>
  );
};

const DocenteLayout = ()=>{
  return (
    <>
    <DocenteNavbar/>
    <Routes>
        <Route path=":idDocente" element={<DocenteCalificacion />} />
        <Route path="listarestudiantes" element={<ListarMisEstudiantes />} />
        <Route path="boletin/:id" element={<GenerarCalificion />} />
        <Route path=":id/mensajes" element={< ListarMensajeDocente/>} />






    </Routes>
    
    
    </>
  )
}




const AppContent = () => {
  const location = useLocation();
  
  // No mostrar headers en login
  if (location.pathname === '/' || location.pathname === '/login') {
    return <Routes>
      <Route path="/*" element={<Login />} />
    </Routes>;
  }

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      
      {/* Rutas protegidas de Operador */}
      <Route element={<ProtectedRoute roles={['Operador']} />}>
        <Route path="/*" element={<OperadorLayout />} />
      </Route>
      
      {/* Rutas protegidas de Estudiante */}
      <Route element={<ProtectedRoute roles={['Estudiante']} />}>
        <Route path="/estudiante/*" element={<EstudianteLayout />} />
      </Route>

      <Route element={<ProtectedRoute roles={['Docente']} />}>
        <Route path="/docente/*" element={<DocenteLayout />} />
      </Route>
    </Routes>
  );
};

const MisRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default MisRoutes;