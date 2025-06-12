import type React from "react";
import { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import type { User, Packet } from "../../types";
import { getAssignedPackets, fetchUserData, updateDeliveryQueue, GetOptimizedRoute } from "../../services/user.service";
import PacketsList from "../PacketsList";
import styles from "./HomeDelivery.module.css";
import PacketsToDeliverBox from "../PacketsToDeliverBox/PacketsToDeliverBox";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RouteMap from "../MapaRepartidor/RouteMap";

const REACT_APP_GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const HomeDelivery: React.FC = () => {
  const location = useLocation();
  const [user, setUser] = useState<User | null>(location.state?.user ?? null);
  const [packets, setPackets] = useState<Packet[]>([]);
  const [optimizedRoute, setOptimizedRoute] = useState<Packet[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState<string>("N/A");
  const [totalDistance, setTotalDistance] = useState<string>("N/A");

  const loadUser = async () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const currentUser = await fetchUserData(token);
      setUser(currentUser);
      return currentUser;
    }
    return null;
  };

  const loadPackets = async (currentUser: User) => {
    const assignedPackets = await getAssignedPackets(currentUser.id);
    setPackets(assignedPackets);
  };

  const calculateRouteMetrics = async (origin: string, destinations: string[]) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destinations.join(
          "|"
        )}&key=${REACT_APP_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      console.log("Respuesta de la API de Google Maps:", data); // Inspeccionar la respuesta

      if (data.rows && data.rows[0] && data.rows[0].elements) {
        const elements = data.rows[0].elements;

        const totalDistance = elements.reduce(
          (acc: number, el: { distance: { value: number }; duration: { value: number } }) => acc + el.distance.value,
          0
        ); // Distancia en metros
        const totalDuration = elements.reduce(
          (acc: number, el: { distance: { value: number }; duration: { value: number } }) => acc + el.duration.value,
          0
        ); // Duración en segundos

        setTotalDistance((totalDistance / 1000).toFixed(2) + " km"); // Convertir a kilómetros
        setEstimatedTime(
          `${Math.floor(totalDuration / 3600)}h ${Math.floor((totalDuration % 3600) / 60)}m` // Convertir a horas y minutos
        );
      } else {
        console.error("La respuesta de la API no contiene los datos esperados.");
      }
    } catch (error) {
      console.error("Error al calcular métricas de la ruta:", error);
      toast.error("Error al calcular métricas de la ruta.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const optimizeRoute = async () => {
    if (!user) {
      toast.error("Usuario no encontrado.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      setLoading(true);
      const route = await GetOptimizedRoute(user.id, user.location ?? "");
      setOptimizedRoute(route);

      const origin = user.location ?? "";
      const destinations = route.map((packet) => packet.destination ?? "");

      console.log("Origin:", origin);
      console.log("Destinations:", destinations);

      if (!origin || destinations.length === 0) {
        console.error("Datos de entrada inválidos para la API de Google Maps.");
        toast.error("No se puede calcular la ruta optimizada debido a datos inválidos.", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      await calculateRouteMetrics(origin, destinations);

      toast.success("¡Ruta optimizada con éxito!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error al optimizar la ruta:", error);
      toast.error("Error al optimizar la ruta.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = user || (await loadUser());
        if (currentUser) {
          await loadPackets(currentUser);
        }
      } catch (error) {
        console.error("Error loading user or packets:", error);
        toast.error("Error al cargar los datos", {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleReorder = (startIndex: number, endIndex: number) => {
    if (startIndex < 0 || endIndex < 0 || startIndex >= packets.length || endIndex >= packets.length) return;

    const updatedQueue = [...packets];
    const [removed] = updatedQueue.splice(startIndex, 1);
    updatedQueue.splice(endIndex, 0, removed);
    setPackets(updatedQueue);
  };

  const handleSaveOrder = async () => {
    if (!user) {
      toast.error("Usuario no encontrado.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      setIsSaving(true);
      const queueIds = packets.map((packet) => packet._id || "");
      await updateDeliveryQueue(user.id, queueIds);
      toast.success("¡Orden de paquetes actualizado con éxito!", {
        position: "top-right",
        autoClose: 3000,
      });
      setIsEditingOrder(false);
    } catch (error) {
      console.error("Error updating delivery queue:", error);
      toast.error("Error al actualizar el orden de paquetes.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const refreshPackets = async () => {
    if (!user) return;

    try {
      const updatedPackets = await getAssignedPackets(user.id);
      setPackets(updatedPackets);
    } catch (error) {
      console.error("Error refreshing packets:", error);
      toast.error("Error al actualizar los paquetes", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const getPriorityClass = (index: number) => {
    if (index === 0) return styles.highPriority;
    if (index === 1) return styles.mediumPriority;
    return styles.lowPriority;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>Cargando dashboard...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className={styles.homeDeliveryContainer}>
      <ToastContainer />

      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Dashboard de Entregas</h1>
          <p className={styles.subtitle}>Gestiona tus paquetes y optimiza tu ruta de entrega</p>
        </div>
        <div className={styles.statsContainer}>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{packets.length}</span>
            <span className={styles.statLabel}>En Cola</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{estimatedTime}</span>
            <span className={styles.statLabel}>Tiempo Est.</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{totalDistance}</span>
            <span className={styles.statLabel}>Distancia</span>
          </div>
        </div>
      </header>

      <div className={styles.mainContent}>
        <section className={styles.leftColumn}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>📦</div>
            <h2 className={styles.sectionTitle}>Paquetes en Almacén</h2>
          </div>
          <div className={styles.sectionContent}>
            <PacketsList onPacketAdded={refreshPackets} />
          </div>
        </section>

        <section className={styles.rightColumn}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>🚚</div>
            <h2 className={styles.sectionTitle}>Cola de Entrega</h2>
            <div className={styles.queueBadge}>{packets.length}</div>
            {packets.length > 0 && (
              <div className={styles.headerActions}>
                {isEditingOrder ? (
                  <>
                    <button
                      className={`${styles.actionButton} ${styles.cancelButton}`}
                      onClick={() => setIsEditingOrder(false)}
                      disabled={isSaving}
                    >
                      ✕ Cancelar
                    </button>
                    <button
                      className={`${styles.actionButton} ${styles.saveButton}`}
                      onClick={handleSaveOrder}
                      disabled={isSaving}
                    >
                      {isSaving ? "⏳ Guardando..." : "💾 Guardar"}
                    </button>
                  </>
                ) : (
                  <button
                    className={`${styles.actionButton} ${styles.editButton}`}
                    onClick={() => setIsEditingOrder(true)}
                  >
                    ✏️ Reordenar
                  </button>
                )}
              </div>
            )}
          </div>

          <div className={styles.sectionContent}>
            {packets.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📭</div>
                <p className={styles.emptyTitle}>No hay paquetes en cola</p>
                <p className={styles.emptyDescription}>Los paquetes asignados aparecerán aquí</p>
              </div>
            ) : (
              <ul className={styles.packetsList}>
                {packets.map((packet, index) => (
                  <li key={packet._id} className={`${styles.packetItem} ${getPriorityClass(index)}`}>
                    <div className={styles.packetHeader}>
                      <div className={styles.packetIcon}>📦</div>
                      <div className={styles.packetMeta}>
                        <span className={styles.packetPosition}>#{index + 1}</span>
                        {index === 0 && <span className={styles.priorityBadge}>Próximo</span>}
                      </div>
                    </div>

                    <div className={styles.packetInfo}>
                      <h3 className={styles.packetName}>{packet.name}</h3>
                      <div className={styles.packetDetails}>
                        <div className={styles.packetDetail}>
                          <span className={styles.detailIcon}>📍</span>
                          <span className={styles.detailText}>{packet.destination ?? "No especificado"}</span>
                        </div>
                        {packet.description && (
                          <div className={styles.packetDetail}>
                            <span className={styles.detailIcon}>📝</span>
                            <span className={styles.detailText}>{packet.description}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {isEditingOrder && (
                      <div className={styles.reorderControls}>
                        <button
                          className={`${styles.orderButton} ${styles.orderButtonUp}`}
                          onClick={() => handleReorder(index, index - 1)}
                          disabled={index === 0}
                          title="Mover arriba"
                        >
                          ↑
                        </button>
                        <button
                          className={`${styles.orderButton} ${styles.orderButtonDown}`}
                          onClick={() => handleReorder(index, index + 1)}
                          disabled={index === packets.length - 1}
                          title="Mover abajo"
                        >
                          ↓
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>

      <section className={styles.bottomSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIcon}>🗺️</div>
          <h2 className={styles.sectionTitle}>Ruta Optimizada</h2>
          <button
            className={`${styles.actionButton} ${styles.optimizeButton}`}
            onClick={optimizeRoute}
          >
            🎯 Optimizar Ruta
          </button>
        </div>
        <div className={styles.routeContent}>
          <PacketsToDeliverBox
            user={{
              ...user,
              location: user.location ?? "",
            }}
            onPacketAdded={refreshPackets}
          />
        </div>
        {/* Mapa de la ruta optimizada */}
        <div style={{ marginTop: 32 }}>
          <RouteMap
            userLocation={user.location ?? ""}
            packets={optimizedRoute.length > 0 ? optimizedRoute : packets}
            onRouteInfo={(distance, duration) => {
              setTotalDistance(distance);
              setEstimatedTime(duration);
            }}
          />
        </div>
      </section>
    </div>
  );
};

export default HomeDelivery;