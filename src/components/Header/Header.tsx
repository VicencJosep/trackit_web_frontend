import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { User } from "lucide-react";
import UserProfile from "../UserProfile";
import { fetchUserData } from "../../services/user.service";
import { User as UserType } from "../../types/index";

const Header = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userData, setUserData] = useState<UserType | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  };

  const handleShowProfile = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const data = await fetchUserData(token);
        setUserData(data);
        setShowProfile(true);
        setUserMenuOpen(false);
      } else {
        console.error("No access token found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleLogoClick = () => {
    navigate("/home");
  };

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/complete-profile";

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <button onClick={handleLogoClick} className={styles.logoButton}>
          <img src="/logoTrackIt.jpg" alt="Logo Track It" className={styles.logo} />
        </button>
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
              <a href="/messages" className={styles.dropdownItem}>
                Mensajes
              </a>
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

      {showProfile && userData && (
        <UserProfile
          user={userData}
          onClose={() => setShowProfile(false)}
        />
      )}
    </header>
  );
};

export default Header;
