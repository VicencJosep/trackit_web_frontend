import React from "react";
import { Mail, Phone, Package, CheckCircle, XCircle } from "lucide-react";
import styles from "./UserProfile.module.css";

interface UserProfileProps {
  user: {
    name: string;
    email: string;
    phone: string;
    available: boolean;
    packets: any[];
  };
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onClose }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.profileCard}>
        <div className={styles.header}>
          <h2>Perfil del Usuario</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <XCircle size={20} />
          </button>
        </div>
        <div className={styles.body}>
          <p><strong>Nombre:</strong> {user.name || "No disponible"}</p>
          <p><Mail size={16} /> <strong>Email:</strong> {user.email || "No disponible"}</p>
          <p><Phone size={16} /> <strong>Teléfono:</strong> {user.phone || "No disponible"}</p>
          <p>
            <CheckCircle size={16} /> <strong>Disponible:</strong> {user.available ? "Sí" : "No"}
          </p>
          <p>
            <Package size={16} /> <strong>Paquetes:</strong> {user.packets.length > 0 ? user.packets.join(", ") : "Ninguno"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;