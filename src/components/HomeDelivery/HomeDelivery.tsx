import React, { useEffect, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { User, Packet } from '../../types';
import { getAssignedPackets, fetchUserData } from '../../services/user.service';
import WarehousePacketsList from '../PacketsList'; // Importa el componente
import './HomeDelivery.module.css';

const HomeDelivery: React.FC = () => {
  const location = useLocation();
  const [user, setUser] = useState<User | null>(location.state?.user ?? null);
  const [packets, setPackets] = useState<Packet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserAndPackets = async () => {
      try {
         let currentUser = user;

        if (!currentUser) {
          const token = localStorage.getItem('accessToken');
          if (token) {
            currentUser = await fetchUserData(token);
            setUser(currentUser);
          }
        }

        if (currentUser) {
          const assignedPackets = await getAssignedPackets(currentUser.id);
          setPackets(assignedPackets);
        }

      } catch (error) {
        console.error('Error loading user or packets:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserAndPackets();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="homeDelivery-container">
      <h1>Home Delivery</h1>

      <section className="packets-queue">
        <h2>Paquetes en cola para repartir</h2>
        {packets.length === 0 ? (
          <p>No hay paquetes asignados.</p>
        ) : (
          <ul className="packets-list">
            {packets.map((packet) => (
              <li key={packet._id} className="packet-item">
                <strong>ID:</strong> {packet._id} <br />
                <strong>Descripción:</strong> {packet.description || 'Sin descripción'}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="warehouse-packets">
        <WarehousePacketsList />
      </section>
    </div>
  );
};

export default HomeDelivery;
