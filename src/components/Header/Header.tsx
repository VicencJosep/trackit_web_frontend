import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { User } from "lucide-react";
import UserProfile from "../UserProfile";
import { fetchUserData } from "../../services/user.service";
import { User as UserType } from "../../types/index"; // Importamos el tipo User


const Header = () => {
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userData, setUserData] = useState<UserType | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (userData) {
      setShowProfile(true);
      setUserMenuOpen(false);    
    }
  }, [userData]);
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
                Perfil
              </button>
              <button
                onClick={() => navigate("/digital-awareness")}
                className={styles.dropdownItem}
              >
                Accesibilidad
              </button>
              <button
                onClick={() => preloadUserAndNavigate("/store")}
                className={styles.dropdownItem}
              >
                Tienda
              </button>
              <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
              </button>
            </div>
          )}
        </div>
      )}

      {showProfile && userData && (
        <UserProfile user={userData} onClose={() => setShowProfile(false)} />
      )}
    </header>
    <nav className={styles.subheader}>
      <ul className={styles.navmenu}>
        <li onClick={() =>preloadUserAndNavigate("/home") }>HOME</li>
        <li onClick={() =>preloadUserAndNavigate("/store") }>STORE</li>
        <li onClick={() =>preloadUserAndNavigate("/messages") }>CHAT</li>

      </ul>
    </nav>
  
    <div className={styles.separator}>
        <div className={styles.titleContainer}>
          <h1 className={styles.titleFoto}>TRACK-IT:</h1>
          <h2 className={styles.subtitleFoto}>Mensajería que no pierde el rumbo</h2>
        </div>
      </div></>
  );
};

export default Header;
