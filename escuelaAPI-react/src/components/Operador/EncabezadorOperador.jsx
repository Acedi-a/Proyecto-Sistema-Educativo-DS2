import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import styles from '../../modules/EncabezadoOperador.module.css';
import { 
  FaHome, 
  FaUserGraduate, 
  FaChalkboardTeacher, 
  FaInfoCircle, 
  FaBars, 
  FaTimes, 
  FaUserCircle,
  FaSignOutAlt 
} from 'react-icons/fa';

const EncabezadoOperador = () => {
  const [menuActive, setMenuActive] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Efecto para manejar el scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Alternar menú móvil
  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  // Manejar clic en enlace de Inicio
  const handleInicioClick = (e) => {
    e.preventDefault();
    toggleMenu();
    navigate(`/inicioOperador/${user.id}`);
  };

  // Manejar clic en otros enlaces
  const handleLinkClick = () => {
    if (menuActive) {
      toggleMenu();
    }
  };

  // Manejar cierre de sesión
  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowDropdown(false);
  };

  // Alternar dropdown de usuario
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>
              <FaUserCircle />
            </span>
            <h1>Panel Operador</h1>
          </div>
          <button 
            className={styles.menuToggle} 
            onClick={toggleMenu}
            aria-label="Menú de navegación"
          >
            {menuActive ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        
        <nav className={`${styles.nav} ${menuActive ? styles.active : ''}`}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <NavLink 
                to={`/inicioOperador/${user.id}`}
                className={({ isActive }) => 
                  `${styles.navLink} ${isActive ? styles.activeOption : ''}`
                }
                onClick={handleInicioClick}
              >
                <FaHome className={styles.icon} />
                <span>Inicio</span>
              </NavLink>
            </li>
            
            <li className={styles.navItem}>
              <NavLink 
                to="/listar-estudiante" 
                className={({ isActive }) => 
                  `${styles.navLink} ${isActive ? styles.activeOption : ''}`
                }
                onClick={handleLinkClick}
              >
                <FaUserGraduate className={styles.icon} />
                <span>Estudiantes</span>
              </NavLink>
            </li>
            
            <li className={styles.navItem}>
              <NavLink 
                to="/listar-docentes" 
                className={({ isActive }) => 
                  `${styles.navLink} ${isActive ? styles.activeOption : ''}`
                }
                onClick={handleLinkClick}
              >
                <FaChalkboardTeacher className={styles.icon} />
                <span>Docentes</span>
              </NavLink>
            </li>
            
            <li className={styles.navItem}>
              <NavLink 
                to="/ListarHorarios" 
                className={({ isActive }) => 
                  `${styles.navLink} ${isActive ? styles.activeOption : ''}`
                }
                onClick={handleLinkClick}
              >
                <FaInfoCircle className={styles.icon} />
                <span>Horarios</span>
              </NavLink>
            </li>
          </ul>
        </nav>
        
        <div className={styles.userContainer}>
          <div 
            className={styles.userAvatarContainer}
            onClick={toggleDropdown}
          >
            <div className={styles.userAvatar}>
              <FaUserCircle />
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>Operador #{user.id}</span>
              <span className={styles.userRole}>Administración</span>
            </div>
          </div>
          
          {showDropdown && (
            <div className={styles.dropdownMenu}>
              <button 
                className={styles.dropdownItem} 
                onClick={handleLogout}
              >
                <FaSignOutAlt className={styles.dropdownIcon} />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default EncabezadoOperador;