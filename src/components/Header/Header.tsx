import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import {
  User,
  Home,
  ShoppingCart,
  MessageSquare,
  Bike,
  LogOut,
  Accessibility,
  Clock,
} from 'lucide-react';
import UserProfile from '../UserProfile';
import { fetchUserData, fetchUsers } from '../../services/user.service';
import { Message, User as UserType } from '../../types/index';
import { useTranslation } from 'react-i18next';
import { Bell } from 'lucide-react';
import { socket } from '../../socket';

type Props = {
  disconnect: () => void;
};

const Header: React.FC<Props> = ({ disconnect }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [messageNotifications, setMessageNotifications] = useState<string>('');
  const [assignedPacketNotif, setAssignedPacketNotif] = useState<string>('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userData, setUserData] = useState<UserType | null>(null);
  const [isDelivery, setIsDelivery] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [generalNotifications, setGeneralNotifications] = useState<string>('');
  const [showDeliveryList, setShowDeliveryList] = useState(false);
  const [deliveryUsers, setDeliveryUsers] = useState<UserType[]>([]);
  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/complete-profile';

  const handleLogout = async () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    socket.disconnect();
    await disconnect();
    window.location.href = '/login';
  };

  const handleShowDeliveryList = async () => {
    try {
      const usersResponse = await fetchUsers();
      const users = (usersResponse as any).data || usersResponse;
      const deliveries = users.filter((u: UserType) => u.role === 'delivery');
      setDeliveryUsers(deliveries);
      setShowDeliveryList(true);
      setUserMenuOpen(false);
    } catch (error) {
      console.error('Error fetching delivery users:', error);
    }
  };

  const handleShowProfile = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const data = await fetchUserData(token);
        setUserData(data);
        setShowProfile(true);
        setUserMenuOpen(false);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleNotifyClick = (message: string) => {
    if (message === 'Messages') {
      setMessageNotifications('');
      preloadUserAndNavigate('/messages');
      setNotifMenuOpen(false);
    } else if (message === 'Packets') {
      setAssignedPacketNotif('');
      setNotifMenuOpen(false);
    }
  };

  const preloadUserAndNavigate = async (path: string) => {
    try {
      let user = userData;
      if (!user) {
        const token = localStorage.getItem('accessToken');
        if (!token) return;
        user = await fetchUserData(token);
        setUserData(user);
      }
      navigate(path, { state: { user } });
      setUserMenuOpen(false);
    } catch (error) {
      console.error('Error navigating:', error);
    }
  };

  useEffect(() => {
    socket.onAny((event, ...args) => {
      console.log('[Socket Evento Recibido]:', event, args);
    });
  }, []);

  useEffect(() => {
    // Handler para mensajes no leídos
    const handleNotification = (message: Message[]) => {
      setGeneralNotifications('Tienes notificaciones nuevas');
      if (!Array.isArray(message) || message.length === 0) {
        setMessageNotifications('');
      } else if (message.length === 1) {
        setMessageNotifications('Tienes 1 mensaje sin leer');
      } else {
        setMessageNotifications(`Tienes ${message.length} mensajes sin leer`);
      }
    };

    // Handler para paquetes asignados
    const handleAssignedPacket = () => {
      setAssignedPacketNotif('Tienes un nuevo paquete en reparto');
      setGeneralNotifications('Tienes notificaciones nuevas');
    };
    socket.on('unseen_messages', handleNotification);
    socket.on('packet_assigned', handleAssignedPacket);

    return () => {
      socket.off('unseen_messages', handleNotification);
      socket.off('packet_assigned', handleAssignedPacket);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token && !userData) {
      fetchUserData(token)
        .then((data) => setUserData(data))
        .catch((err) => console.error('Error preloading user data:', err));
    }
  }, [userData, location.pathname]);

  useEffect(() => {
    setIsDelivery(userData?.role === 'delivery');
  }, [userData]);

  return (
    <>
      <header className={styles.header}>
        <div
          className={styles.brand}
          onClick={!isAuthPage ? () => preloadUserAndNavigate('/home') : undefined}
          style={{ cursor: isAuthPage ? 'default' : 'pointer' }}
        >
          <img src="/logoTrackIt.jpg" alt="Logo Track It" className={styles.logo} />
          <span className={styles.title}>
            TRACK<span className={styles.highlight}>IT</span>
          </span>
        </div>

        {!isAuthPage && (
          <>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <Bell
                size={18}
                style={{ marginRight: 8 }}
                onClick={() => {
                  setNotifMenuOpen(!notifMenuOpen);
                  setGeneralNotifications('');
                }}
              />
              {generalNotifications && (
                <span className={styles.notificationBadge}>{generalNotifications}</span>
              )}
              {notifMenuOpen && (
                <div className={styles.notificationsDropdownContainer}>
                  {messageNotifications && (
                    <div
                      className={styles.notificationsDropdown}
                      onClick={() => handleNotifyClick('Messages')}
                    >
                      <span className={styles.notificationText}>{messageNotifications}</span>
                    </div>
                  )}
                  {assignedPacketNotif && (
                    <div
                      className={styles.notificationsDropdown}
                      onClick={() => handleNotifyClick('Packets')}
                    >
                      <span className={styles.notificationText}>{assignedPacketNotif}</span>
                    </div>
                  )}
                  {!messageNotifications && !assignedPacketNotif && (
                    <div className={styles.notificationsDropdown}>
                      <span className={styles.noNotifications}>
                        {String(t('No Notifications'))}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className={styles.userMenu}>
              <button className={styles.userButton} onClick={() => setUserMenuOpen(!userMenuOpen)}>
                <User size={24} />
              </button>
              {userMenuOpen && (
                <div className={styles.userDropdown}>
                  <button onClick={handleShowProfile} className={styles.dropdownItem}>
                    <User size={16} />
                    {String(t('header.profile'))}
                  </button>
                  <button
                    onClick={() => navigate('/digital-awareness')}
                    className={styles.dropdownItem}
                  >
                    <Accessibility size={16} />
                    {String(t('header.accessibility'))}
                  </button>
                  <button onClick={() => navigate('/historial')} className={styles.dropdownItem}>
                    <Clock size={16} style={{ marginRight: 8 }} />
                    Historial
                  </button>
                  <button onClick={handleShowDeliveryList} className={styles.dropdownItem}>
                    <Bike size={16} style={{ marginRight: 8 }} />
                    Ver repartidores
                  </button>
                  <button onClick={handleLogout} className={styles.logoutButton}>
                    <LogOut size={16} />
                    {String(t('header.logout'))}
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {showProfile && userData && (
          <UserProfile user={userData} onClose={() => setShowProfile(false)} />
        )}
      </header>

      {/* MODAL DE REPARTIDORES */}
      {showDeliveryList && (
        <div className={styles.deliveryListModal}>
          <div className={styles.deliveryListContent}>
            <h2>Repartidores</h2>
            <button
              onClick={() => setShowDeliveryList(false)}
              style={{ float: 'right', marginBottom: 12 }}
            >
              Cerrar
            </button>
            <ul>
              {deliveryUsers.length === 0 && <li>No hay repartidores.</li>}
              {deliveryUsers.map((u) => (
                <li
                  key={u.id}
                  style={{ marginBottom: 16, borderBottom: '1px solid #ccc', paddingBottom: 8 }}
                >
                  <strong>Nombre:</strong> {u.name}
                  <br />
                  <strong>Email:</strong> {u.email}
                  <br />
                  <strong>Teléfono:</strong> {u.phone}
                  <br />
                  <strong>Vehículo:</strong> {u.deliveryProfile?.vehicle || 'N/A'}
                  <br />
                  <strong>Paquetes asignados:</strong>{' '}
                  {u.deliveryProfile?.assignedPacket?.length || 0}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {!isAuthPage && (
        <nav className={styles.subheader}>
          <ul className={styles.navmenu}>
            <li onClick={() => preloadUserAndNavigate('/home')}>
              <Home size={18} style={{ marginRight: 8 }} />
              {String(t('header.home'))}
            </li>
            <li onClick={() => preloadUserAndNavigate('/store')}>
              <ShoppingCart size={18} style={{ marginRight: 8 }} />
              {String(t('header.store'))}
            </li>
            <li onClick={() => preloadUserAndNavigate('/messages')}>
              <MessageSquare size={18} style={{ marginRight: 8 }} />
              {String(t('header.chat'))}
            </li>
            {isDelivery && (
              <li onClick={() => preloadUserAndNavigate('/homeDelivery')}>
                <Bike size={18} style={{ marginRight: 8 }} />
                {String(t('header.delivery'))}
              </li>
            )}
          </ul>
        </nav>
      )}

      <div className={styles.separator}>
        <div className={styles.titleContainer}>
          <h1 className={styles.titleFoto}>TRACK-IT:</h1>
          <h2 className={styles.subtitleFoto}>{String(t('header.subtitle'))}</h2>
        </div>
      </div>
    </>
  );
};

export default Header;
