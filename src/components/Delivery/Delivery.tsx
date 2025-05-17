import React, { useEffect, useState } from 'react';
import styles from './Delivery.module.css';
import { GetUserPackets } from '../../services/user.service';
import { Packet } from '../../types';
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

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
      <h1 className={styles.title}>{String(t("delivery.title"))}</h1>
      {loading ? (
        <p>{String(t("delivery.loading"))}</p>
      ) : packages.length === 0 ? (
        <p>{String(t("delivery.empty"))}</p>
      ) : (
        <div className={styles.packagesContainer}>
          {packages.map((pkg) => (
            <div
              key={pkg._id}
              className={styles.packageCard}
              onClick={() => handlePackageClick(pkg)}
            >
              <h2 className={styles.packageTitle}>{pkg.name}</h2>
              <p className={styles.packageInfo}>
                {String(t("delivery.description"))}: {pkg.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Delivery;