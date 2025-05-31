import React, { useEffect, useState } from 'react';
import {
  assignPacketToDelivery,
  getAllPackets,
  updatePacketStatus
} from '../../services/user.service';
import styles from './PacketsList.module.css';
import { Packet } from '../../types';

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error parsing JWT:', e);
    return null;
  }
}

const PacketsList: React.FC = () => {
  const [packets, setPackets] = useState<Packet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackets = async () => {
      try {
        const allPackets = await getAllPackets();
        // Filtrar solo los que estén en almacén
        const filtered = allPackets.filter(packet => packet.status === 'almacén');
        setPackets(filtered);
      } catch (err) {
        setError('Error cargando los paquetes.');
      } finally {
        setLoading(false);
      }
    };

    fetchPackets();
  }, []);

  const handleAssign = async (packetId: string) => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      setError('Token no encontrado. Inicia sesión.');
      return;
    }

    const payload = parseJwt(token);
    const userId = payload?.id;

    if (!userId) {
      setError('ID de usuario no encontrado en el token.');
      return;
    }

    try {
      await assignPacketToDelivery(userId, packetId);
      const packetToUpdate = packets.find(p => p._id === packetId);

      if (!packetToUpdate) {
        setError('Paquete no encontrado en la lista.');
        return;
      }

      // Actualizar status a "en reparto"
      await updatePacketStatus({ ...packetToUpdate, status: 'en reparto',deliveryId: userId });

      // Eliminar de la lista los que se han asignado
      setPackets(prev => prev.filter(p => p._id !== packetId));
    } catch (err) {
      setError('Error asignando paquete.');
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
          {packets.map(packet => (
            <li key={packet._id} className={styles.item}>
              <span>
                <strong>Nombre:</strong> {packet.name} <br />
                <strong>Descripción:</strong> {packet.description} <br />
                <strong>Destino:</strong> {packet.destination ?? "No especificado"}
              </span>
              <button onClick={() => handleAssign(packet._id!)}>Añadir a la cola</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PacketsList;
