import React from 'react';
import { User } from '../../types/index'; // Asegúrate de que la ruta sea correcta según tu estructura de carpetas

interface UserProfileProps {
  user: User;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  return (
    <div className="user-profile">
      <h1>Perfil del Usuario</h1>
      <div className="user-details">
        <p><strong>Nombre:</strong> {user.name || 'No disponible'}</p>
        <p><strong>Email:</strong> {user.email || 'No disponible'}</p>
        <p><strong>Teléfono:</strong> {user.phone || 'No disponible'}</p>
        <p><strong>Disponible:</strong> {user.available ? 'Sí' : 'No'}</p>
        <p><strong>Paquetes:</strong> {user.packets.length > 0 ? user.packets.join(', ') : 'Ninguno'}</p>
      </div>
    </div>
  );
};

export default UserProfile;