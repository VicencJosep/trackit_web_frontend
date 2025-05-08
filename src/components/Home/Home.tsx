import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import Warehouse from '../Warehouse/Warehouse';
import Delivery from '../Delivery/Delivery';
import styles from './Home.module.css'; // CORREGIDO
import { User } from '../../types';

const Home: React.FC = () => {
  const location = useLocation();
  const user = location.state?.user as User | undefined;
  console.log('User from location state:', user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const warehouseUser = {
    id: user._id || 'unknown-id',
    name: user.name,
    email: user.email,
    phone: user.phone,
  };

  return (
    <div className={styles.homeContainer}>
      <h1>Bienvenido, {user.name}</h1>
    
      <div className={styles.flexContainer}>
        <div className={styles.section}>
          <h2>Paquetes en Almacén</h2>
          <Warehouse user={warehouseUser} />
        </div>

        <div className={styles.section}>
          <h2>Paquetes en Reparto</h2>
          <Delivery user={warehouseUser} />
        </div>
      </div>
    </div>
  );
};

export default Home;
