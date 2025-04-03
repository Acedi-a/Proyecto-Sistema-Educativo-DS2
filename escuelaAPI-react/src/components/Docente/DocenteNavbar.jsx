import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, Bookmark, CalendarDays, ClipboardCheck, 
  FileText, Users, Menu, X, LogOut, 
  MessageCircle
} from 'lucide-react';
import { useAuth } from '../Auth/AuthContext.jsx';

export const DocenteNavbar = ({  }) => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const linkClasses = ({ isActive }) => 
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
      isActive 
        ? 'bg-blue-50 text-blue-700 font-semibold' 
        : 'text-gray-600 hover:bg-gray-100'
    }`;

  const links = [
    { to: `/docente/${user.id}`, text: "Inicio", icon: <Home size={18} /> },
    { to: "/docente/calificaciones", text: "Calificaciones", icon: <Bookmark size={18} /> },
    { to: "/docente/horarios", text: "Horarios", icon: <CalendarDays size={18} /> },
    { to: "/docente/asistencia", text: "Asistencias", icon: <ClipboardCheck size={18} /> },
    { to: "/docente/listarestudiantes", text: "Boletin", icon: <FileText size={18} /> },
    { to: "/docente/estudiantes", text: "Estudiantes", icon: <Users size={18} /> },
    { to: `/docente/${user.id}/mensajes`, text: "Mensajes", icon: <MessageCircle size={18} /> }

  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-blue-600">EscuelaPlus</span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {links.map(link => (
              <NavLink key={link.to} to={link.to} className={linkClasses}>
                {link.icon}
                <span>{link.text}</span>
              </NavLink>
            ))}
            <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 ml-4">
              <LogOut size={18} />
              <span>Cerrar sesión</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white pb-4 px-4 space-y-2 shadow-md">
          {links.map(link => (
            <NavLink 
              key={link.to} 
              to={link.to} 
              className={linkClasses}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.icon}
              <span>{link.text}</span>
            </NavLink>
          ))}
          <button className="w-full flex items-center gap-2 p-3 text-gray-600 hover:bg-gray-100 rounded-lg">
            <LogOut size={18} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      )}
    </nav>
  );
};