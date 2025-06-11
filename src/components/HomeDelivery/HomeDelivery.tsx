import React, { useEffect, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { User, Packet } from '../../types';
import { getAssignedPackets, fetchUserData, updateDeliveryQueue } from '../../services/user.service';
import PacketsList from '../PacketsList';
import styles from './HomeDelivery.module.css';
import PacketsToDeliverBox from '../PacketsToDeliverBox/PacketsToDeliverBox';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const HomeDelivery: React.FC = () => {
  const location = useLocation();
  const [user, setUser] = useState<User | null>(location.state?.user ?? null);
  const [packets, setPackets] = useState<Packet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReorder, setShowReorder] = useState(false);
  const [isEditingOrder, setIsEditingOrder] = useState(false);
 
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
  }, [user]);

  const handleReorder = (startIndex: number, endIndex: number) => {
    const updatedQueue = [...packets];
    const [removed] = updatedQueue.splice(startIndex, 1);
    updatedQueue.splice(endIndex, 0, removed);
    setPackets(updatedQueue);
  };

  const handleSaveOrder = async () => {
    if (!user) {
      toast.error('User not found.', {
          position: "top-right",
          autoClose: 3000,
      });         
      return;
    }

    try {
      const queueIds = packets.map((packet) => packet._id || '');
      await updateDeliveryQueue(user.id, queueIds);
      toast.success('¡Orden de paquetes actualizado con éxito!', {
          position: "top-right",
          autoClose: 3000,
      });      
      setIsEditingOrder(false);
    } catch (error) {
      console.error('Error updating delivery queue:', error);
      toast.error('Error al actualizar el orden de paquetes.', {
          position: "top-right",
          autoClose: 3000,
      });         
    }
  };

  if (loading) return <div className={styles.loading}>Cargando...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className={styles.homeDeliveryContainer}>
      <ToastContainer />
      <h1 className={styles.title}>Home Delivery</h1>

      <section 
        className={styles.packetsQueue}
        onMouseEnter={() => setShowReorder(true)}
        onMouseLeave={() => !isEditingOrder && setShowReorder(false)}
      >
        <div className={styles.queueHeader}>
          <h2 className={styles.subtitle}>Paquetes en cola para repartir</h2>
          {showReorder && !isEditingOrder && packets.length > 0 && (
            <button 
              className={styles.reorderButton}
              onClick={() => setIsEditingOrder(true)}
            >
              Cambiar orden paquetes
            </button>
          )}
        </div>
        
        {packets.length === 0 ? (
          <p className={styles.noPackets}>No hay paquetes asignados.</p>
        ) : (
          <ul className={styles.packetsList}>
            {packets.map((packet, index) => (
              <li key={packet._id} className={styles.packetItem}>
                <div className={styles.packetInfo}>
                  <strong>Nombre:</strong> {packet.name} <br />
                  <strong>Destino:</strong> {packet.destination ?? 'No especificado'}
                  <br />
                  <strong>Descripción:</strong> {packet.description || 'Sin descripción'}
                </div>
                
                {isEditingOrder && (
                  <div className={styles.reorderControls}>
                    <button 
                      className={styles.orderButton}
                      onClick={() => handleReorder(index, index - 1)} 
                      disabled={index === 0}
                    >
                      ↑
                    </button>
                    <button 
                      className={styles.orderButton}
                      onClick={() => handleReorder(index, index + 1)} 
                      disabled={index === packets.length - 1}
                    >
                      ↓
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        {isEditingOrder && packets.length > 0 && (
          <div className={styles.saveControls}>
            <button 
              className={styles.saveButton}
              onClick={handleSaveOrder}
            >
              Guardar cambios
            </button>
            <button 
              className={styles.cancelButton}
              onClick={() => {
                setIsEditingOrder(false);
                setShowReorder(false);
              }}
            >
              Cancelar
            </button>
          </div>
        )}
      </section>

      <section className={styles.warehousePackets}>
        <PacketsList />
      </section>
      <PacketsToDeliverBox user={user} />
    </div>
  );
};

export default HomeDelivery;