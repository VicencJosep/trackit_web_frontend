import React, { useEffect, useState } from 'react';
import { GetUserPackets } from "../../services/user.service";
import { Packet } from '../../types';
import styles from './Historial.module.css';

function getUserIdFromToken(): string | null {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    return payload.id || payload._id || null;
  } catch {
    return null;
  }
}

const formatDate = (date: Date | string | undefined): string => {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

const Historial: React.FC = () => {
  const [deliveredPackets, setDeliveredPackets] = useState<Packet[]>([]);

  useEffect(() => {
    const userId = getUserIdFromToken();
    if (userId) {
      GetUserPackets(userId)
        .then(packets => {
          const delivered = packets.filter((p: Packet) => p.status === "entregado");
          setDeliveredPackets(delivered);
        })
        .catch(error => {
          console.error("Error al obtener los paquetes:", error);
        });
    }
  }, []);

  return (
    <div className={styles.historialContainer}>
      <h1>📦 Historial de Entregas</h1>
      <p>Consulta aquí todos los paquetes que ya han sido entregados.</p>
      <div className={styles.packetList}>
        {deliveredPackets.map((packet: Packet) => (
          <div key={packet._id} className={styles.packetItem}>
            <div className={styles.packetHeader}>
              <div className={styles.packetTitle}>
                📦 <strong>{packet.name}</strong>
              </div>
              <p>{packet.description}</p>
            </div>
            <div className={styles.packetDates}>
              <div>🕒 Creado: <span>{formatDate(packet.createdAt)}</span></div>
              <div>🚚 Entregado: <span>{formatDate(packet.deliveredAt)}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Historial;
