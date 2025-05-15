import React, { useEffect, useState } from 'react';
import styles from './Delivery.module.css';
import { GetUserPackets } from '../../services/user.service';
import { Packet } from '../../types';

interface DeliveryProps {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  onSelectPacket?: (packetId: string) => void;
}

const Delivery: React.FC<DeliveryProps> = ({ user, onSelectPacket }) => {
  const [packages, setPackages] = useState<Packet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPackages = async () => {
      try {
        const allPackages = await GetUserPackets(user.id);
        const deliveryPackages = allPackages.filter((pkg) => pkg.status === 'en reparto');
        setPackages(deliveryPackages);
      } catch (error) {
        console.error('Error fetching packages:', error);
      } finally {
        setLoading(false);
      }
    };

    getPackages();
  }, [user.id]);

  const handlePackageClick = (pkg: Packet) => {
    if (onSelectPacket && pkg._id) {
      onSelectPacket(pkg._id);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Paquetes en Reparto</h1>
      {loading ? (
        <p>Cargando paquetes...</p>
      ) : packages.length === 0 ? (
        <p>No tienes paquetes en reparto.</p>
      ) : (
        <div className={styles.packagesContainer}>
          {packages.map((pkg) => (
            <div
              key={pkg._id}
              className={styles.packageCard}
              onClick={() => handlePackageClick(pkg)}
            >
              <h2 className={styles.packageTitle}>{pkg.name}</h2>
              <p className={styles.packageInfo}>Descripción: {pkg.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Delivery;