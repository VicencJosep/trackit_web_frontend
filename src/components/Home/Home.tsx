import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import Warehouse from '../Warehouse/Warehouse';
import Delivery from '../Delivery/Delivery'; // Importamos el componente Delivery
import styles from './Home.module.css';
import { User } from '../../types';

const Home: React.FC = () => {
  const location = useLocation();
  const user = location.state?.user as User | undefined;
  console.log('User from location state:', user); // Verificamos el usuario recibido

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
    <div className={styles.homeContainer}>
      {/* <p>Correo: {user.email}</p> */}
      <div className={styles.sectionsContainer}>
      <div className={styles.section}>
        <Warehouse user={warehouseUser} />
      </div>
      <div className={styles.section}>
        <Delivery user={warehouseUser} />
      </div>
    </div>
    </div>
  );
};

export default Home;
