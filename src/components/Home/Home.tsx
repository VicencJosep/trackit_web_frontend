import React, { useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import Warehouse from '../Warehouse/Warehouse';
import Delivery from '../Delivery/Delivery';
import PackageMap from '../PackageMap'; // Importa desde index.ts
import styles from './Home.module.css';
import { User } from '../../types';
import AdminTablesModal from '../AdminTablesModal/AdminTablesModal'; // Importa el modal de tablas

const Home: React.FC = () => {
  const location = useLocation();
  const user = location.state?.user as User | undefined;
  const [selectedPacketId, setSelectedPacketId] = useState<string | null>(null);
  const [showAdminTables, setShowAdminTables] = useState(false); 

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const warehouseUser = {
    id: user.id || 'unknown-id',
    name: user.name,
    email: user.email,
    phone: user.phone,
  };

  return (
    <div className={styles.homeContainer}>
      {}
      <button
        className={styles.adminTablesButton}
        onClick={() => setShowAdminTables(true)}
        style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}
      >
        Ver info de usuarios y paquetes
      </button>

      {showAdminTables && (
  <AdminTablesModal onClose={() => setShowAdminTables(false)} />
)}

      <div className={styles.sectionsContainer}>
        <div className={styles.section}>
          <Warehouse user={warehouseUser} />
        </div>
        <div className={styles.section}>
          <Delivery user={warehouseUser} onSelectPacket={setSelectedPacketId} />
        </div>
      </div>
      {/* Mapa debajo de las tablas */}
      <PackageMap userId={warehouseUser.id} selectedPacketId={selectedPacketId} />
    </div>
  );
};

export default Home;