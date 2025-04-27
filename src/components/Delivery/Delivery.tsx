import React, { useEffect, useState } from 'react';
import styles from './Delivery.module.css'; // Asegúrate de tener un archivo CSS para los estilos
import { GetUserPackets } from '../../services/user.service'; // Importa la función para obtener los paquetes
import { Packet } from '../../types'; // Importa la interfaz de los paquetes

interface DeliveryProps {
  user: {
    id: string; // id ahora es requerido por Delivery
    name: string;
    email: string;
    phone: string;
  };
}

const Delivery: React.FC<DeliveryProps> = ({ user }) => {
  const [packages, setPackages] = useState<Packet[]>([]);
  const [loading, setLoading] = useState(true); // Estado para manejar la carga

  useEffect(() => {
    const getPackages = async () => {
      try {
        const allPackages = await GetUserPackets(user.id); // Usa el ID del usuario si es necesario
        const deliveryPackages = allPackages.filter((pkg) => pkg.status === 'en reparto');
        setPackages(deliveryPackages);
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
              <p className={styles.packageInfo}>ID: {pkg._id}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Delivery;
