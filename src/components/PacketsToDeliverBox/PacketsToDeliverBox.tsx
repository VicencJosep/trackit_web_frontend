import React, { useEffect, useState } from 'react';
import styles from './Box.module.css';
import { getAssignedPackets, GetOptimizedRoute } from '../../services/user.service';
import { Packet } from '../../types';
import { useTranslation } from "react-i18next"; // Añade esto


interface PacketsToDeliverBoxProps {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

const PacketsToDeliverBox: React.FC<PacketsToDeliverBoxProps> = ({ user }) => {
  const [packages, setPackages] = useState<Packet[]>([]);
  const [optimizedRoute, setOptimizedRoute] = useState<Packet[]>([]); // Cambia el tipo según tu necesidad
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation(); // Añade esto

  useEffect(() => {
    const getPackages = async () => {
      try {
        //const allPackages = await getAssignedPackets(user.id); // Usa el ID del usuario si es necesario    
        //setPackages(allPackages);
      } catch (error) {
        console.error('Error fetching packages:', error);
      } finally {
        setLoading(false); // Finaliza la carga
      }
    };
    const getOptimizedRoute = async () =>{
        try{
            //const response = await GetOptimizedRoute(user.id, '41.27721, 1.99017');

            //setOptimizedRoute(response);
           
        }
        catch (error) {
            console.error('Error fetching optimized route:', error);

        }
        finally {
            setLoading(false); // Finaliza la carga
        }
    };
    getPackages();
    getOptimizedRoute();
  }, [user.id, optimizedRoute]); // Añade optimizedRoute.length para evitar bucles infinitos

  const handlePackageClick = (pkg: Packet) => {
    alert(`Has seleccionado el paquete: ${pkg.name} (ID: ${pkg._id})`);
  };

 return (
  <div className={styles.mainWrapper} style={{ display: 'flex', gap: 32 }}>
    {/* Contenedor de ruta optimizada (derecha) */}
    <div className={styles.optimizedRouteSection} style={{ flex: 1 }}>
      {(!loading && optimizedRoute.length > 0) && (
        <>
          <h2 style={{ marginTop: 32 }}>Ruta Optimizada</h2>
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

