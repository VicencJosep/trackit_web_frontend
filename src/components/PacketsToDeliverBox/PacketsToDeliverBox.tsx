import React, { useEffect, useState } from 'react';
import styles from './Box.module.css';
import { getAssignedPackets, GetOptimizedRoute, updateDeliveryQueue } from '../../services/user.service';
import { Packet } from '../../types';
import { useTranslation } from "react-i18next"; // Añade esto


interface PacketsToDeliverBoxProps {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    location: string; // Ubicación del usuario
  };
  onPacketAdded?: () => void; // Nueva prop para actualizar la lista en HomeDelivery
}

const PacketsToDeliverBox: React.FC<PacketsToDeliverBoxProps> = ({ user, onPacketAdded }) => {
  const [packages, setPackages] = useState<Packet[]>([]);
  const [optimizedRoute, setOptimizedRoute] = useState<Packet[]>([]); // Cambia el tipo según tu necesidad
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation(); // Añade esto

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Iniciar la carga
      try {
        const [allPackages, optimizedRouteResponse] = await Promise.all([
          getAssignedPackets(user.id),
          GetOptimizedRoute(user.id, user.location),
        ]);
        setPackages(allPackages);
        setOptimizedRoute(optimizedRouteResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Finaliza la carga
      }
    };

    if (user.id) {
      fetchData(); // Ejecutar solo si user.id está definido
    }
  }, [user.id]); // Solo depende de user.id

  const handlePackageClick = (pkg: Packet) => {
    alert(`Has seleccionado el paquete: ${pkg.name} (ID: ${pkg._id})`);
  };

 return (
  <div className={styles.mainWrapper} style={{ display: 'flex', gap: 32 }}>
    {/* Contenedor de ruta optimizada (derecha) */}
    <div className={styles.optimizedRouteSection} style={{ flex: 1 }}>
      {(!loading && optimizedRoute.length > 0) && (
        <>
          {/* Se elimina el título redundante */}
          <ol className={styles.routeList}>
            {optimizedRoute.map((pkg, idx) => (
              <li
                key={pkg._id}
                className={styles.packageCard}
                onClick={() => handlePackageClick(pkg)}
                style={{ marginBottom: 16 }}
              >
                <div>
                  <strong>#{idx + 1}</strong> - <span>{pkg.destination}</span>
                </div>
                <div>
                  <span className={styles.packageTitle}>{pkg.name}</span>
                </div>
                <div className={styles.packageInfo}>
                  {String(t("warehouse.description"))}: {pkg.description}
                </div>
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  </div>
);};

export default PacketsToDeliverBox;

