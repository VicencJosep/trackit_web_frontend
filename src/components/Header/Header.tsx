import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { User as UserType} from "../../types/index";

import UserProfile from "../UserProfile";
import { Home, ShoppingCart, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  };

  const preloadUserAndNavigate = (path: string) => {
    navigate(path);
    setUserMenuOpen(false);
  };

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/complete-profile";

  return (
    <>
      <header className={styles.header}>
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
                <button onClick={() => setShowProfile(true)} className={styles.dropdownItem}>
                  {String(t("header.profile"))}
                </button>
                <button
                  onClick={() => navigate("/digital-awareness")}
                  className={styles.dropdownItem}
                >
                  {String(t("header.accessibility"))}
                </button>
                <button
                  onClick={() => preloadUserAndNavigate("/store")}
                  className={styles.dropdownItem}
                >
                  {String(t("header.store"))}
                </button>
                <button onClick={handleLogout} className={styles.logoutButton}>
                  {String(t("header.logout"))}
                </button>
              </div>
            )}
          </div>
        )}

        {showProfile && (
          <UserProfile onClose={() => setShowProfile(false)} />
        )}
      </header>

      {!isAuthPage && (
        <nav className={styles.subheader}>
          <ul className={styles.navmenu}>
            <li onClick={() => preloadUserAndNavigate("/home")}>
              <Home size={18} style={{ marginRight: 8, verticalAlign: "middle" }} />
              {String(t("header.home"))}
            </li>
            <li onClick={() => preloadUserAndNavigate("/store")}>
              <ShoppingCart size={18} style={{ marginRight: 8, verticalAlign: "middle" }} />
              {String(t("header.store"))}
            </li>
            <li onClick={() => preloadUserAndNavigate("/messages")}>
              <MessageSquare size={18} style={{ marginRight: 8, verticalAlign: "middle" }} />
              {String(t("header.chat"))}
            </li>
          </ul>
        </nav>
      )}

      <div className={styles.separator}>
        <div className={styles.titleContainer}>
          <h1 className={styles.titleFoto}>TRACK-IT:</h1>
          <h2 className={styles.subtitleFoto}>Mensajería que no pierde el rumbo</h2>
        </div>
      </div>
    </>
  );
};

export default Header;