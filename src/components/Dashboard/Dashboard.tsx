import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './Dashboard.module.css';
import { Packet } from '../../types/index';

// Crear un icono personalizado
const packageIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1554/1554561.png', // Cambia esto a la ruta de tu imagen
    iconSize: [32, 32], // Tamaño del icono
    iconAnchor: [16, 32], // Punto de anclaje del icono
    popupAnchor: [0, -32], // Punto de anclaje del popup
});

const Dashboard: React.FC = () => {
    const [selectedPacket, setSelectedPacket] = useState<Packet | null>(null);
    const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);

    const packets: Packet[] = [
        { _id: '1', name: 'Paquete 1', description: 'Descripción 1', status: 'En tránsito', ubicacion: '40.7128,-74.0060' },
        { _id: '2', name: 'Paquete 2', description: 'Descripción 2', status: 'Entregado', ubicacion: '34.0522,-118.2437' },
        { _id: '3', name: 'Paquete 3', description: 'Descripción 3', status: 'Pendiente', ubicacion: '51.5074,-0.1278' },
    ];

    const handleRowClick = (packet: Packet) => {
        if (!packet.ubicacion) {
            console.error('El paquete no tiene una ubicación definida.');
            return;
        }
    
        setSelectedPacket(packet);
        const [lat, lng] = packet.ubicacion.split(',').map(Number);
        setCurrentLocation([lat, lng]); // Inicializar la ubicación actual
    };

    // Simular movimiento del paquete
    useEffect(() => {
        if (!selectedPacket || !currentLocation) return;
    
        const interval = setInterval(() => {
            setCurrentLocation((location) => {
                if (!location) return null; // Verificar que no sea null
                const [lat, lng] = location;
                // Simular un pequeño cambio en las coordenadas
                const newLat = lat + (Math.random() - 0.5) * 0.01; // Variación aleatoria
                const newLng = lng + (Math.random() - 0.5) * 0.01;
                return [newLat, newLng];
            });
        }, 1000); // Actualizar cada segundo
    
        return () => clearInterval(interval); // Limpiar el intervalo al desmontar o cambiar de paquete
    }, [selectedPacket, currentLocation]);

    const SetInitialView = () => {
        const map = useMap();
        map.setView([0, 0], 2);
        return null;
    };

    const SetViewOnPacket = ({ location }: { location: [number, number] | null }) => {
        const map = useMap();
        if (location) {
            map.setView(location, 13);
        }
        return null;
    };

    return (
        <div className={styles.dashboardContainer}>
            <h1>Welcome to the Package Management System</h1>
            <h2>Your Active Packages</h2>

            <table className={styles.packetTable}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {packets.map((packet) => (
                        <tr key={packet._id} onClick={() => handleRowClick(packet)}>
                            <td>{packet.name}</td>
                            <td>{packet.description}</td>
                            <td>{packet.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className={styles.mapContainer}>
                <MapContainer style={{ height: '400px', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <SetInitialView />
                    {currentLocation && <SetViewOnPacket location={currentLocation} />}
                    {currentLocation && (
                        <Marker
                            position={currentLocation}
                            icon={packageIcon} // Usar el icono personalizado
                        >
                            <Popup>{selectedPacket?.name}</Popup>
                        </Marker>
                    )}
                </MapContainer>
            </div>
        </div>
    );
};

export default Dashboard;