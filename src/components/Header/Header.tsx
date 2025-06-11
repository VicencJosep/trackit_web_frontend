import { useState, useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { User, Home, ShoppingCart, MessageSquare, Bike, LogOut, Accessibility } from "lucide-react";
import UserProfile from "../UserProfile";
import { fetchUserData } from "../../services/user.service";
import { Message, User as UserType } from "../../types/index";
import { useTranslation } from "react-i18next";
import { Bell } from "lucide-react";
import { socket } from '../../socket';

type Props = {
  disconnect: () => void;
};

const Header: React.FC<Props> = ({ disconnect }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [messageNotifications, setMessageNotifications] = useState<string>('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userData, setUserData] = useState<UserType | null>(null);
  const [isDelivery, setIsDelivery] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/complete-profile";

  const handleLogout = async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    socket.disconnect();
    await disconnect();
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
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  const handleNotifyMessageClick = () => {
    setMessageNotifications("");
     preloadUserAndNavigate("/messages");
     setNotifMenuOpen(false);
  };
  const preloadUserAndNavigate = async (path: string) => {
    try {
      let user = userData;
      if (!user) {
        const token = localStorage.getItem("accessToken");
        if (!token) return;
        user = await fetchUserData(token);
        setUserData(user);
      }
      navigate(path, { state: { user } });
      setUserMenuOpen(false);
    } catch (error) {
      console.error("Error navigating:", error);
    }
  };
  useEffect(() => {
    const handleNotification = (message: Message[]) => {
      if (!Array.isArray(message) || message.length === 0) {
        setMessageNotifications("");
      } else if (message.length === 1) {
        setMessageNotifications("Tienes 1 mensaje sin leer");
      } else {
        setMessageNotifications(`Tienes ${message.length} mensajes sin leer`);
      }
    };    
    socket.on("unseen_messages", handleNotification);
    console.log("Recibido unseen_messages:");


    return () => {
      socket.off("unseen_messages", handleNotification);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token && !userData) {
      fetchUserData(token)
        .then((data) => setUserData(data))
        .catch((err) => console.error("Error preloading user data:", err));
    }
  }, [userData, location.pathname]);

  useEffect(() => {
    setIsDelivery(userData?.role === "delivery");
  }, [userData]);

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
          <><div style={{ position: "relative", display: "inline-block" }}>
            <Bell size={18} style={{ marginRight: 8 }} onClick={() => setNotifMenuOpen(!notifMenuOpen)} />
            {notifMenuOpen && (
              <div className={styles.notificationsDropdown} onClick={handleNotifyMessageClick}>
                {messageNotifications ? (
                  <span className={styles.notificationText}>{messageNotifications}</span>
                ) : (
                  <span className={styles.noNotifications}>{String(t("No Notifications"))}</span>
                )}
              </div>
            )}
          </div>
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
                    <User size={16} />
                    {String(t("header.profile"))}
                  </button>
                  <button
                    onClick={() => navigate("/digital-awareness")}
                    className={styles.dropdownItem}
                  >
                    <Accessibility size={16} />
                    {String(t("header.accessibility"))}
                  </button>
                  <button onClick={handleLogout} className={styles.logoutButton}>
                    <LogOut size={16} />
                    {String(t("header.logout"))}
                  </button>
                </div>
              )}
            </div></>
        )}

        {showProfile && userData && (
          <UserProfile user={userData} onClose={() => setShowProfile(false)} />
        )}
      </header>

      {!isAuthPage && (
        <nav className={styles.subheader}>
          <ul className={styles.navmenu}>
            <li onClick={() => preloadUserAndNavigate("/home")}>
              <Home size={18} style={{ marginRight: 8 }} />
              {String(t("header.home"))}
            </li>
            <li onClick={() => preloadUserAndNavigate("/store")}>
              <ShoppingCart size={18} style={{ marginRight: 8 }} />
              {String(t("header.store"))}
            </li>
            <li onClick={() => preloadUserAndNavigate("/messages")}>
              <MessageSquare size={18} style={{ marginRight: 8 }} />
              {String(t("header.chat"))}
            </li>
            {isDelivery && (
              <li onClick={() => preloadUserAndNavigate("/homeDelivery")}>
                <Bike size={18} style={{ marginRight: 8 }} />
                {String(t("header.delivery"))}
              </li>
            )}
          </ul>
        </nav>
      )}

      <div className={styles.separator}>
        <div className={styles.titleContainer}>
          <h1 className={styles.titleFoto}>TRACK-IT:</h1>
          <h2 className={styles.subtitleFoto}>{String(t("header.subtitle"))}</h2>
        </div>
      </div>
    </>
  );
};

export default Header;
