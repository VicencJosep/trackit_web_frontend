import React, { useEffect, useState } from 'react';
import styles from './Warehouse.module.css'; // Importa los estilos desde el archivo CSS
import { GetUserPackets } from '../../services/user.service'; // Importa la función para obtener los paquetes
import { Packet } from '../../types'; // Importa la interfaz de los paquetes

interface WarehouseProps {
  user: {
    id: string; // id ahora es requerido por Warehouse
    name: string;
    email: string;
    phone: string;
  };
}

const Warehouse: React.FC<WarehouseProps> = ({ user }) => {
  const [packages, setPackages] = useState<Packet[]>([]);
  const [loading, setLoading] = useState(true); // Estado para manejar la carga

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
      <h1 className={styles.title}>Paquetes en Almacén</h1>
      {loading ? (
        <p>Cargando paquetes...</p>
      ) : packages.length === 0 ? (
        <p>No tienes paquetes en el almacén.</p>
      ) : (
        <div className={styles.packagesContainer}>
          {packages.map((pkg) => (
            <div
              key={pkg._id}
              className={styles.packageCard}
              onClick={() => handlePackageClick(pkg)}
            >
              <h2 className={styles.packageTitle}>{pkg.name}</h2>
              <p className={styles.packageInfo}>ID: {pkg.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Warehouse;

