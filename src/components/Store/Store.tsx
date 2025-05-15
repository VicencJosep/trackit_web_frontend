import React, { useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import styles from "./Store.module.css";
import { buyPacket, createPacket } from "../../services/user.service";
import { Packet, User } from "../../types";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Asegúrate de importar los estilos
import { toast } from 'react-toastify';
// Función para convertir dirección a coordenadas usando Google Maps Geocoding API
async function getCoordsFromAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""; // Pon tu API Key de Google Maps aquí
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
  );
  const data = await response.json();
  if (data.status === 'OK' && data.results.length > 0) {
    const location = data.results[0].geometry.location;
    return { lat: location.lat, lng: location.lng };
  }
  return null;
}

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
    status: "en reparto",
    createdAt: new Date("2025-02-15"),
    size: 20,
    weight: 0.4,
    origin: "41.387019, 2.170047",
    destination: "41.403629, 2.174356",
  },
  {
    name: "Mochila deportiva",
    description: "Mochila ligera y resistente para entrenamiento.",
    status: "en reparto",
    createdAt: new Date("2025-03-01"),
    size: 30,
    weight: 0.6,
    origin: "41.379021, 2.140101",
    destination: "41.414495, 2.152694",
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
  const location = useLocation();
  const user = location.state?.user as User | undefined;
  const [showAddressInput, setShowAddressInput] = useState(false);
  const [address, setAddress] = useState('');
  const [packetToBuy, setPacketToBuy] = useState<Packet | null>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  // Usa SIEMPRE las mismas opciones en toda la app para evitar el error del loader
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "",
    libraries: ['places'],
  });

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Cuando el usuario hace click en "Comprar"
  const handleBuyClick = (packet: Packet) => {
    setPacketToBuy(packet);
    setShowAddressInput(true);
  };

  // Cuando el usuario selecciona una dirección sugerida
  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      setAddress(place.formatted_address || "");
    }
  };

  // Cuando el usuario acepta la dirección
  const handleAddressSubmit = async () => {
    if (!address || !packetToBuy) {
      toast.error("Por favor, introduce una dirección válida.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    const coords = await getCoordsFromAddress(address);
    if (!coords) {
      toast.error("No se pudo encontrar la dirección.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    // Guardamos el paquete con la dirección convertida a coordenadas
    const packetWithCoords = {
      ...packetToBuy,
      destination: `${coords.lat}, ${coords.lng}`,
    };
    setShowAddressInput(false);
    setAddress('');
    setPacketToBuy(null);
    await handleBuy(packetWithCoords);
  };

  // Lógica de compra (igual que antes)
  const handleBuy = async (packet: Packet) => {
    if (!user) {
      toast.error("Debes iniciar sesión para comprar un paquete.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    try {
      // Paso 1: Crear el paquete en la base de datos
      const createdPacket = await createPacket(packet);
      // Verificamos si el paquete fue creado correctamente
      console.log("Paquete creado:", createdPacket);

      // Paso 2: Asociarlo al usuario
      if (createdPacket._id && user.name) {
        console.log("ID del paquete creado:", createdPacket._id, "nombre del usuario:", user.name);
        await buyPacket(user.name, createdPacket._id);
        toast.success(`Has comprado: ${packet.name}`, {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error("Error al asociar el paquete al usuario.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("Hubo un error al procesar tu compra.", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("Error al comprar el paquete:", error);
    }
  };

  return (
    <div>
      <div className={styles.container}>
        <ToastContainer />
        <h1>Bienvenido a la Tienda, {user.name}</h1>
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
                onClick={() => handleBuyClick(packet)}
              >
                Comprar
              </button>
            </div>
          ))}
        </div>
      </div>
      {showAddressInput && isLoaded && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ background: 'white', padding: 20, borderRadius: 8 }}>
            <h3>Introduce tu dirección de origen</h3>
            <Autocomplete
              onLoad={ac => setAutocomplete(ac)}
              onPlaceChanged={onPlaceChanged}
            >
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Ej: Passeig de Gràcia, 1, Barcelona"
                style={{ width: 300 }}
              />
            </Autocomplete>
            <div style={{ marginTop: 10 }}>
              <button onClick={handleAddressSubmit}>Aceptar</button>
              <button onClick={() => setShowAddressInput(false)} style={{ marginLeft: 10 }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Store;