import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import styles from "./Store.module.css";
import { buyPacket } from "../../services/user.service";
import { Packet } from "../../types"; // Importamos la interfaz Packet
import { User } from "../../types"; // Importamos la interfaz User
import { createPacket } from "../../services/user.service";
import { useTranslation } from "react-i18next";

const packets: Packet[] = [
  {
    name: "Caja de Zapatillas Nike",
    description: "Zapatillas deportivas edición limitada.",
    status: "almacén",
    createdAt: new Date("2024-12-01"),
    size: 35,
    weight: 1.2,
    origin: "Barcelona",
    destination: "Madrid",
  },
  {
    name: "Equipación FC Barcelona",
    description: "Camiseta, pantalón y medias oficiales.",
    status: "almacén",
    createdAt: new Date("2025-01-10"),
    size: 25,
    weight: 0.8,
    origin: "Barcelona",
    destination: "Valencia",
  },
  {
    name: "Balón Oficial FIFA",
    description: "Balón de fútbol profesional.",
    status: "almacén",
    createdAt: new Date("2025-02-15"),
    size: 20,
    weight: 0.4,
    origin: "Sevilla",
    destination: "Bilbao",
  },
  {
    
    name: "Mochila deportiva",
    description: "Mochila ligera y resistente para entrenamiento.",
    status: "almacén",
    createdAt: new Date("2025-03-01"),
    size: 30,
    weight: 0.6,
    origin: "Madrid",
    destination: "Zaragoza",
  },
  {
    name: "Pack de Proteínas",
    description: "Suplementos deportivos para recuperación.",
    status: "almacén",
    createdAt: new Date("2025-03-20"),
    size: 15,
    weight: 2.5,
    origin: "Valencia",
    destination: "Granada",
  },
];

const Store: React.FC = () => {
  const { t } = useTranslation();

  const location = useLocation();
  const user = location.state?.user as User | undefined;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleBuy = async (packet: Packet) => {
    if (!user) {
      alert("Debes iniciar sesión para comprar un paquete.");
      return;
    }
   try {
    // Paso 1: Crear el paquete en la base de datos
    const createdPacket = await createPacket(packet);
    // Verificamos si el paquete fue creado correctamente
    
      console.log("Paquete creado:", createdPacket);
    
    // Paso 2: Asociarlo al usuario
    if (createdPacket._id && user.name) {
      console.log("ID del paquete creado:", createdPacket._id , "nomber del usuario:", user.name);
      await buyPacket(user.name, createdPacket._id);
      alert(`Has comprado: ${packet.name}`);
    } else {
      alert("Error al asociar el paquete al usuario.");
    }
  } catch (error) {
    alert("Hubo un error al procesar tu compra.");
    console.error("Error al comprar el paquete:", error);
  }
  };

  return (
    <div>
      <div className={styles.container}>
        <h1>{String(t("store.title"))} {user.name}</h1> {/* Traducción */}
        <div className={styles.grid}>
          {packets.map((packet, index) => (
            <div key={index} className={styles.card}>
              <h2>{packet.name}</h2>
              <p>{packet.description}</p>
              <p>
                <strong>Estado:</strong> {packet.status}
              </p>
              <p>
                <strong>Tamaño:</strong> {packet.size} cm
              </p>
              <p>
                <strong>Peso:</strong> {packet.weight} kg
              </p>
              <p>
                <strong>Origen:</strong> {packet.origin}
              </p>
              <p>
                <strong>Destino:</strong> {packet.destination}
              </p>
              <button
                className={styles.buyButton}
                onClick={() => handleBuy(packet)}
              >
                Comprar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Store;
