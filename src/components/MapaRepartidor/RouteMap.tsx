import React, { useEffect, useState } from 'react';
import { updatePacketStatus, markPacketAsDelivered } from '../../services/user.service';
import { GoogleMap, DirectionsRenderer, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Packet } from '../../types';
import packageIcon from '../../assets/1f4e6.svg';
import { toast } from 'react-toastify'; // Añadido

const containerStyle: React.CSSProperties = {
  width: '100%',
  height: '500px',
  position: 'relative',
};

interface RouteMapProps {
  userLocation: string;
  packets: Packet[];
  onRouteInfo: (distance: string, duration: string) => void;
}

function parseLatLng(location: string) {
  const parts = location.split(',');
  if (parts.length === 2) {
    const lat = parseFloat(parts[0]);
    const lng = parseFloat(parts[1]);
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
  }
  return location;
}

// Helper para obtener el userId del accessToken
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

const RouteMap: React.FC<RouteMapProps> = ({ userLocation, packets, onRouteInfo }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
  });

  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [selectedPacket, setSelectedPacket] = useState<Packet | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>('');

  useEffect(() => {
    if (!isLoaded || packets.length === 0) return;

    const origin = parseLatLng(userLocation);
    const destinations = packets.map((p) => parseLatLng(p.destination ?? ''));

    let waypoints: { location: google.maps.LatLngLiteral | string; stopover: boolean }[] = [];
    let destination = destinations[destinations.length - 1];

    if (destinations.length > 1) {
      waypoints = destinations.slice(0, -1).map((loc) => ({
        location: loc,
        stopover: true,
      }));
    }

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin,
        destination,
        waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true,
      },
      (result, status) => {
        if (status === 'OK' && result) {
          setDirections(result);
          const legs = result.routes[0].legs;
          const totalDistance = legs.reduce((acc, l) => acc + (l.distance?.value || 0), 0);
          const totalDuration = legs.reduce((acc, l) => acc + (l.duration?.value || 0), 0);
          onRouteInfo(
            (totalDistance / 1000).toFixed(2) + ' km',
            Math.round(totalDuration / 60) + ' min',
          );
        } else {
          setDirections(null);
          onRouteInfo('N/A', 'N/A');
        }
      },
    );
  }, [isLoaded, packets, userLocation, onRouteInfo]);

  const handleMarkerClick = (packet: Packet) => {
    setSelectedPacket(packet);

    // Obtener dirección legible a partir de lat,lng
    const geocoder = new window.google.maps.Geocoder();
    const coords = parseLatLng(packet.destination ?? '');
    if (typeof coords === 'object' && 'lat' in coords && 'lng' in coords) {
      geocoder.geocode({ location: coords }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          setSelectedAddress(results[0].formatted_address);
        } else {
          setSelectedAddress('Dirección no disponible');
        }
      });
    }
  };

  // NUEVO: Lógica para entregar paquete
  const handleDeliverPacket = async () => {
    if (!selectedPacket) return;
    const userId = getUserIdFromToken();
    if (!userId) {
      toast.error('No se pudo obtener el usuario actual.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }
    try {
      console.log('Entregando paquete:', selectedPacket._id, 'por el usuario:', userId);

      await updatePacketStatus({ ...selectedPacket, status: 'entregado', deliveredAt: new Date() });
      await markPacketAsDelivered(userId, selectedPacket._id!);

      toast.success('¡Paquete entregado correctamente!', {
        position: 'top-right',
        autoClose: 3000,
      });
      setSelectedPacket(null);
    } catch (error) {
      toast.error('Error al marcar el paquete como entregado.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  if (!isLoaded) return <div>Cargando mapa...</div>;

  let center = { lat: 41.3874, lng: 2.1686 };
  const parsed = parseLatLng(userLocation);
  if (typeof parsed === 'object' && 'lat' in parsed && 'lng' in parsed) {
    center = parsed;
  }

  return (
    <div style={{ position: 'relative' }}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
        {directions && <DirectionsRenderer directions={directions} />}
        {packets.map((packet, index) => {
          const coords = parseLatLng(packet.destination ?? '');
          if (typeof coords === 'object' && 'lat' in coords && 'lng' in coords) {
            return (
              <Marker
                key={index}
                position={coords}
                icon={{
                  url: packageIcon,
                  scaledSize: new window.google.maps.Size(40, 40),
                }}
                onClick={() => handleMarkerClick(packet)}
              />
            );
          }
          return null;
        })}
      </GoogleMap>

      {selectedPacket && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            backgroundColor: 'white',
            padding: '12px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            zIndex: 1000,
            maxWidth: '300px',
          }}
        >
          <h3 style={{ marginTop: 0 }}>{selectedPacket.name}</h3>
          <p>
            <strong>Peso:</strong> {selectedPacket.weight} kg
            <br />
            <strong>Tamaño:</strong> {selectedPacket.size} cm
            <br />
            <strong>Dirección:</strong> {selectedAddress}
          </p>
          <button
            style={{
              padding: '8px 12px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: 8,
            }}
            onClick={handleDeliverPacket}
          >
            Entregar paquete
          </button>
          <button
            style={{
              padding: '8px 12px',
              backgroundColor: '#ccc',
              color: '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
            onClick={() => setSelectedPacket(null)}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default RouteMap;
