import React, { useEffect, useState } from 'react';
import { assignPacketToDelivery } from '../../services/user.service';
import { getAllPackets } from '../../services/user.service';
import styles from './WarehousePacketsList.module.css';
import { Packet } from '../../types';

const PacketsList: React.FC = () => {
    const [packets, setPackets] = useState<Packet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userId = localStorage.getItem('userId'); // o desde contexto si lo prefieres

  useEffect(() => {
    const fetchPackets = async () => {
      try {
        const allPackets = await getAllPackets();
        const warehousePackets = allPackets.filter(p => p.status === 'warehouse');
        setPackets(warehousePackets);
      } catch (err) {
        setError('Error cargando los paquetes');
      } finally {
        setLoading(false);
      }
    };

    fetchPackets();
  }, []);

  const handleAssign = async (packetId: string) => {
    if (!userId) {
      setError('Usuario no autenticado');
      return;
    }

    try {
      await assignPacketToDelivery(userId, packetId);
      setPackets(prev => prev.filter(p => p._id !== packetId));
    } catch (err) {
      setError('Error asignando paquete');
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>
      <h2>Paquetes en almacén</h2>
      {packets.length === 0 ? (
        <p>No hay paquetes disponibles en almacén.</p>
      ) : (
        <ul className={styles.list}>
          {packets
            .filter(packet => packet._id) // filtrar solo con _id definido
            .map(packet => (
              <li key={packet._id} className={styles.item}>
                <span><strong>Dirección:</strong> {packet.origin}</span>
                <button onClick={() => handleAssign(packet._id!)}>Añadir a la cola</button>
              </li>
            ))
          }
        </ul>
      )}
    </div>
  );
};
    export default PacketsList;