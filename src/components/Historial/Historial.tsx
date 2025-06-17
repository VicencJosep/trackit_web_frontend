import React, { useEffect, useState } from 'react';
import { GetUserPackets } from '../../services/user.service';
import { Packet } from '../../types';
import styles from './Historial.module.css';
import { useTranslation } from 'react-i18next';

function getUserIdFromToken(): string | null {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    const payload = JSON.parse(jsonPayload);
    return payload.id || payload._id || null;
  } catch {
    return null;
  }
}

const formatDate = (date: Date | string | undefined, t: any): string => {
  if (!date) return String(t('historial.noDate'));
  const d = new Date(date);
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const Historial: React.FC = () => {
  const { t } = useTranslation();
  const [deliveredPackets, setDeliveredPackets] = useState<Packet[]>([]);

  useEffect(() => {
    const userId = getUserIdFromToken();
    if (userId) {
      GetUserPackets(userId)
        .then((packets) => {
          const delivered = packets.filter((p: Packet) => p.status === 'entregado');
          setDeliveredPackets(delivered);
        })
        .catch((error) => {
          console.error('Error al obtener los paquetes:', error);
        });
    }
  }, []);

  return (
    <div className={styles.historialContainer}>
      <h1>📦 {String(t('historial.title'))}</h1>
      <p>{String(t('historial.subtitle'))}</p>
      <div className={styles.packetList}>
        {deliveredPackets.length === 0 ? (
          <p>{String(t('historial.empty'))}</p>
        ) : (
          deliveredPackets.map((packet: Packet) => (
            <div key={packet._id} className={styles.packetItem}>
              <div className={styles.packetHeader}>
                <div className={styles.packetTitle}>
                  📦 <strong>{packet.name}</strong>
                </div>
                <p>{packet.description}</p>
              </div>
              <div className={styles.packetDates}>
                <div>
                  🕒 {String(t('historial.createdAt'))}:{' '}
                  <span>{formatDate(packet.createdAt, t)}</span>
                </div>
                <div>
                  🚚 {String(t('historial.deliveredAt'))}:{' '}
                  <span>{formatDate(packet.deliveredAt, t)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Historial;
