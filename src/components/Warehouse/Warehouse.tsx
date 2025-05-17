import React, { useEffect, useState } from 'react';
import styles from './Warehouse.module.css';
import { GetUserPackets } from '../../services/user.service';
import { Packet } from '../../types';
import { useTranslation } from "react-i18next"; // Añade esto

interface WarehouseProps {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

const Warehouse: React.FC<WarehouseProps> = ({ user }) => {
  const [packages, setPackages] = useState<Packet[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation(); // Añade esto

  useEffect(() => {
    const getPackages = async () => {
      try {
        const allPackages = await GetUserPackets(user.id); // Usa el ID del usuario si es necesario
        const warehousePackages = allPackages.filter((pkg) => pkg.status === 'almacén');
        setPackages(warehousePackages);
      } catch (error) {
        console.error('Error fetching packages:', error);
      } finally {
        setLoading(false); // Finaliza la carga
      }
    };

    getPackages();
  }, [user.id]);

  const handlePackageClick = (pkg: Packet) => {
    alert(`Has seleccionado el paquete: ${pkg.name} (ID: ${pkg._id})`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{String(t("warehouse.title"))}</h1>
      {loading ? (
        <p>{String(t("warehouse.loading"))}</p>
      ) : packages.length === 0 ? (
        <p>{String(t("warehouse.empty"))}</p>
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
                {String(t("warehouse.description"))}: {pkg.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Warehouse;
