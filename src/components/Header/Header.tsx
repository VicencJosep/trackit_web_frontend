import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./Header.module.css";
import { User } from "lucide-react";
import UserProfile from "../UserProfile";
import { fetchUserData } from "../../services/user.service";
import { User as UserType } from "../../types/index"; // Importamos el tipo User

const Header = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userData, setUserData] = useState<UserType | null>(null); // Definimos el tipo del estado
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  };

  const handleShowProfile = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const data = await fetchUserData(token); // Llamamos a la función para obtener los datos del usuario
        setUserData(data); // Ahora TypeScript sabe que data es del tipo User
        setShowProfile(true);
        setUserMenuOpen(false);
      } else {
        console.error("No access token found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

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
              <button onClick={handleShowProfile} className={styles.dropdownItem}>
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
      {showProfile && userData && (
        <UserProfile
          user={userData}
          onClose={() => setShowProfile(false)} // Cerrar el perfil
        />
      )}
    </header>
  );
};

export default Header;
