import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import Warehouse from '../Warehouse/Warehouse';
import Delivery from '../Delivery/Delivery'; // Importamos el componente Delivery
import './Home.module.css';
import { User } from '../../types';

const Home: React.FC = () => {
  const location = useLocation();
  const user = location.state?.user as User | undefined;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Mapeamos el user de MongoDB al formato que Warehouse y Delivery esperan
  const warehouseUser = {
    id: user._id || 'unknown-id', // Usamos _id de MongoDB como id, con un valor por defecto
    name: user.name,
    email: user.email,
    phone: user.phone,
  };

  return (
    <div className="home-container">
      <h1>Bienvenido, {user.name}</h1>
      <p>Correo: {user.email}</p>
      
      {/* Componente Warehouse */}
      <div className="section">
        <h2>Paquetes en Almacén</h2>
        <Warehouse user={warehouseUser} />
      </div>

      {/* Componente Delivery */}
      <div className="section">
        <h2>Paquetes en Reparto</h2>
        <Delivery user={warehouseUser} />
      </div>
    </div>
  );
};

export default Home;
