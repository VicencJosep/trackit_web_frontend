
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { User } from "lucide-react";
import UserProfile from "../UserProfile";
import { fetchUserData } from "../../services/user.service";
import { User as UserType } from "../../types/index"; // Importamos el tipo User
import { Home, ShoppingCart, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next"; // Importamos el hook de traducción

const Header = () => {
  const { t } = useTranslation(); // Inicializamos el hook de traducción
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userData, setUserData] = useState<UserType | null>(null);
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

  const preloadUserAndNavigate = async (path: string) => {
    try {
      let user = userData;
      if (!user) {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.error("No access token found");
          return;
        }
        user = await fetchUserData(token);
        setUserData(user);
      }
      navigate(path, { state: { user } });
      setUserMenuOpen(false);
    } catch (error) {
      console.error("Error navigating:", error);
    }
  };

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/complete-profile";

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token && !userData) {
      fetchUserData(token)
        .then((data) => setUserData(data))
        .catch((err) => console.error("Error preloading user data:", err));
    }
  }, [userData]);

  return (
    <><header className={styles.header}>
      <div
        className={styles.brand}
        onClick={!isAuthPage ? () => preloadUserAndNavigate("/home") : undefined}
        style={{ cursor: isAuthPage ? "default" : "pointer" }}
      >
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
                 {String(t("header.profile"))} {/* Traducción */}
              </button>
              <button
                onClick={() => navigate("/digital-awareness")}
                className={styles.dropdownItem}
              >
                                  {String(t("header.accessibility"))} {/* Traducción */}

              </button>
              <button
                onClick={() => preloadUserAndNavigate("/store")}
                className={styles.dropdownItem}
              >
                                  {String(t("header.store"))} {/* Traducción */}

              </button>
              <button onClick={handleLogout} className={styles.logoutButton}>
                                  {String(t("header.logout"))} {/* Traducción */}

              </button>
            </div>
          )}
        </div>
      )}

      {showProfile && userData && (
        <UserProfile user={userData} onClose={() => setShowProfile(false)} />
      )}
    </header>
    {!isAuthPage && (
      <nav className={styles.subheader}>
        <ul className={styles.navmenu}>
          <li onClick={() => preloadUserAndNavigate("/home")}>
            <Home size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                          {String(t("header.home"))} {/* Traducción */}

          </li>
          <li onClick={() => preloadUserAndNavigate("/store")}>
            <ShoppingCart size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                          {String(t("header.store"))} {/* Traducción */}

          </li>
          <li onClick={() => preloadUserAndNavigate("/messages")}>
            <MessageSquare size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                          {String(t("header.chat"))} {/* Traducción */}

          </li>
        </ul>
      </nav>
    )}

  
  
    <div className={styles.separator}>
        <div className={styles.titleContainer}>
          <h1 className={styles.titleFoto}>TRACK-IT:</h1>
          <h2 className={styles.subtitleFoto}>{String(t("header.subtitle"))}</h2>
        </div>
      </div></>
  );
};

export default Header;