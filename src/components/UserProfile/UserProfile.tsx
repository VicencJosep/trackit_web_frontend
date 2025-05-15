import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, XCircle } from "lucide-react";
import styles from "./UserProfile.module.css";
import { User } from "../../types/index";
import { updateUser, deleteUser } from "../../services/user.service";

interface UserProfileProps {
  user: User;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onClose }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<User>(user);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = async () => {
    if (!formData.id) {
      console.error("No se puede actualizar: ID de usuario no disponible");
      return;
    }

    try {
      console.log("Actualizando perfil del usuario:", formData);
      await updateUser(formData.id, formData);
      console.log("Perfil actualizado con éxito");

      // Eliminar tokens y redirigir al login
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/login");
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
    }
  };

  const handleDelete = async () => {
    if (!user.id) {
      console.error("No se puede eliminar: ID de usuario no disponible");
      return;
    }

    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar tu cuenta?");
    if (confirmDelete) {
      try {
        console.log("Eliminando cuenta del usuario:", user.id);
        await deleteUser(user.id);

        // Eliminar tokens, cerrar el perfil y redirigir al login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        onClose(); // Cierra la pestaña del perfil
        navigate("/login");
      } catch (error) {
        console.error("Error al eliminar la cuenta:", error);
      }
    }
  };

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
          <label>
            <strong>Nombre:</strong>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!editing}
            />
          </label>
          <label>
            <Mail size={16} /> <strong>Email:</strong>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!editing}
            />
          </label>
          <label>
            <Phone size={16} /> <strong>Teléfono:</strong>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!editing}
            />
          </label>
        </div>
        <div className={styles.actions}>
          {!editing ? (
            <button onClick={() => setEditing(true)} className={styles.editButton}>
              Editar Perfil
            </button>
          ) : (
            <button onClick={handleEdit} className={styles.editButton}>
              Guardar Cambios
            </button>
          )}
          <button onClick={handleDelete} className={styles.deleteButton}>
            Eliminar Cuenta
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;