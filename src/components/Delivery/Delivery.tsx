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
  const [selectedPacketId, setSelectedPacketId] = useState<string | null>(null);
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
  if (pkg._id) {
    setSelectedPacketId(pkg._id);
  }
    if (onSelectPacket && pkg._id) {
      onSelectPacket(pkg._id);
    }
  };
  const handleChatClick = (packet: Packet) => {
    console.log("Iniciar chat con repartidor del paquete:", user.id);
    console.log("deliveryId del repartidor:", packet.deliveryId);

  // Aquí podrías abrir un modal, redirigir, o iniciar un chat
  
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
              {selectedPacketId === pkg._id && (
                <button className={styles.chatButton}
                  
               onClick={(e) => {
               e.stopPropagation();
                   if (pkg._id) {handleChatClick(pkg);}
                  } }
     >
                  💬 {String(t("delivery.contactCourier", "Hablar con repartidor"))}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Delivery;
