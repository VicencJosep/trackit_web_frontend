import { useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./Header.module.css";
import { User } from "lucide-react";
import UserProfile from "../UserProfile"; // Importamos el componente UserProfile

const Header = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false); // Estado para mostrar el perfil
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login"; // Redirige al login después de cerrar sesión
  };

  // Ocultar el menú de usuario si estamos en /login o /register
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <img src="/logoTrackIt.jpg" alt="Logo Track It" className={styles.logo} />
        <span className={styles.title}>
          TRACK<span className={styles.highlight}>IT</span>
        </span>
      </div>

      {!isAuthPage && (
        <div className={styles.userMenu}>
          <button
            className={styles.userButton}
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <User size={24} />
          </button>
          {userMenuOpen && (
            <div className={styles.userDropdown}>
              <button
                onClick={() => {
                  setShowProfile(true); // Mostrar el perfil al hacer clic
                  setUserMenuOpen(false); // Cerrar el menú desplegable
                }}
                className={styles.dropdownItem}
              >
                Perfil
              </button>
              <a href="/settings" className={styles.dropdownItem}>
                Configuración
              </a>
              <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mostrar el componente UserProfile si showProfile es true */}
      {showProfile && <UserProfile />}
    </header>
  );
};

export default Header;
