import React, { useState } from 'react';
import { NavLink } from "react-router-dom";
import {
    Home, 
    Award, 
    CalendarDays,
    CreditCard, 
    FileText, 
    ClipboardCheck, 
    Menu,
    X,
    MessageCircle
} from "lucide-react";
import {useAuth} from "../Auth/AuthContext.jsx";

export const Navbar = () => {
    const { user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const linkBaseClasses = "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out";
    const linkInactiveClasses = "text-slate-600 hover:bg-black/5 hover:text-slate-900";
    const linkActiveClasses = "bg-indigo-500 text-white shadow-inner font-semibold";

    const handleLogout = () => {
        logout(); 
        navigate('/'); 
    };

    const getNavLinkClass = ({ isActive }) => {
        return `${linkBaseClasses} ${isActive ? linkActiveClasses : linkInactiveClasses}`;
    };

    const navLinks = [
        { to: `/estudiante/${user.id}`, text: "Inicio", icon: <Home size={18} /> },
        { to: "/estudiante/calificacion", text: "Calificaciones", icon: <Award size={18} /> },
        { to: "/estudiante/horario", text: "Horario", icon: <CalendarDays size={18} /> },
        { to: "/estudiante/pago", text: "Pagos", icon: <CreditCard size={18} /> },
        { to: "/estudiante/examen", text: "Exámenes", icon: <FileText size={18} /> },
        { to: "/estudiante/asistencia", text: "Asistencia", icon: <ClipboardCheck size={18} /> },
        { to: `/estudiante/listar/${user.id}`, text: "Mensajes", icon: <MessageCircle size={18} /> },
    ];

    return (
        <nav className="sticky top-4 z-50 mx-4 md:mx-auto md:max-w-4xl lg:max-w-6xl backdrop-blur-xl bg-white/60 border border-white/30 shadow-xl rounded-2xl transition-all duration-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0">
                        <NavLink to="/estudiante" className="text-2xl font-bold bg-gradient-to-r mr-3 from-indigo-500 to-purple-600 text-transparent bg-clip-text hover:opacity-80 transition-opacity">
                            Educaciones Gon
                        </NavLink>
                    </div>

                    <div className="hidden md:flex md:items-center md:space-x-1 lg:space-x-2">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={getNavLinkClass}
                                end={link.to === "/estudiante"} 
                            >
                                {link.icon}
                                <span>{link.text}</span>
                            </NavLink>
                        ))}
                        <button
                            className="bg-indigo-600 hover:bg-white text-white hover:text-indigo-600 px-4 py-1  rounded-3xl"
                            onClick={handleLogout}>
                            Cerrar Sesión
                        </button>
                    </div>

                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                            aria-controls="mobile-menu"
                            aria-expanded={isMobileMenuOpen}
                        >
                            <span className="sr-only">Abrir menú principal</span>
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 mx-0 mt-2 rounded-b-2xl bg-white/90 backdrop-blur-lg shadow-lg border border-t-0 border-white/30 overflow-hidden" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) =>
                                    `${linkBaseClasses} w-full justify-start ${isActive ? linkActiveClasses : linkInactiveClasses}`
                                }
                                onClick={() => setIsMobileMenuOpen(false)} // Cierra el menú al hacer clic
                                end={link.to === "/estudiante"}
                            >
                                {link.icon}
                                <span>{link.text}</span>
                            </NavLink>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}