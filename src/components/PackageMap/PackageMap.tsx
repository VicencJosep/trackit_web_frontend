import React, { useEffect, useState, useRef } from 'react';
import {
  GoogleMap,
  Marker,
  DirectionsService,
  DirectionsRenderer,
  useJsApiLoader,
} from '@react-google-maps/api';
import { Packet, User } from '../../types';
import { fetchUsers, getAllPackets } from '../../services/user.service'; // Asegúrate de tener estos servicios

interface PackageMapProps {
  userId: string;
  selectedPacketId: string | null;
}

const containerStyle = { width: '100%', height: '800px' };

const PackageMap: React.FC<PackageMapProps> = ({ userId, selectedPacketId }) => {
  const [routePackets, setRoutePackets] = useState<Packet[]>([]);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [eta, setEta] = useState<string | null>(null);
  const [origin, setOrigin] = useState<{ lat: number; lng: number } | null>(null);

  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
  });

  // Utilidad para convertir string "lat,lng" a objeto
  const toLatLng = (coords: any): { lat: number; lng: number } | undefined => {
    if (!coords) return undefined;
    if (Array.isArray(coords) && coords.length === 2) {
      return { lat: Number(coords[0]), lng: Number(coords[1]) };
    }
    if (typeof coords === 'string') {
      const [lat, lng] = coords.split(',').map(Number);
      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng };
      }
    }
    return undefined;
  };

  // 1. Buscar el repartidor y los paquetes de su ruta
  useEffect(() => {
    if (!selectedPacketId) {
      setRoutePackets([]);
      setDirections(null);
      setEta(null);
      setOrigin(null);
      return;
    }
    const fetchRoute = async () => {
      const [usersResponse, allPackets] = await Promise.all([fetchUsers(), getAllPackets()]);
      const users = (usersResponse as any).data;

      const delivery: User | undefined = users.find(
        (u: User) =>
          u.role === 'delivery' && u.deliveryProfile?.assignedPacket?.includes(selectedPacketId),
      );
      if (!delivery || !delivery.deliveryProfile) {
        setRoutePackets([]);
        setDirections(null);
        setEta(null);
        setOrigin(null);
        return;
      }
      // Obtener los paquetes asignados hasta el seleccionado (incluido)
      const assignedIds = delivery.deliveryProfile.assignedPacket;
      const idx = assignedIds.indexOf(selectedPacketId);
      if (idx === -1) {
        setRoutePackets([]);
        setDirections(null);
        setEta(null);
        setOrigin(null);
        return;
      }
      const packetsInRoute = assignedIds
        .slice(0, idx + 1)
        .map((id) => allPackets.find((p: Packet) => p._id === id))
        .filter(Boolean) as Packet[];
      setRoutePackets(packetsInRoute);
      setOrigin(toLatLng(delivery.location) ?? null);
      setDirections(null);
      setEta(null);
    };
    fetchRoute();
  }, [selectedPacketId]);

  // 2. Calcular la ruta en Google Maps
  useEffect(() => {
    if (!isLoaded || !origin || routePackets.length === 0) return;
    const destinations = routePackets.map((p) => toLatLng(p.destination)).filter(Boolean) as {
      lat: number;
      lng: number;
    }[];
    if (destinations.length === 0) return;
    const waypoints = destinations.slice(0, -1).map((loc) => ({ location: loc, stopover: true }));
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin,
        destination: destinations[destinations.length - 1],
        waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
        optimizeWaypoints: false,
      },
      (result, status) => {
        if (status === 'OK' && result) {
          setDirections(result);
          const legs = result.routes[0].legs;
          const totalDuration = legs.reduce((acc, l) => acc + (l.duration?.value || 0), 0);
          if (totalDuration) {
            const etaDate = new Date(Date.now() + totalDuration * 1000);
            setEta(etaDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          }
        } else {
          setDirections(null);
          setEta(null);
        }
      },
    );
  }, [isLoaded, origin, routePackets]);

  // Ajustar el mapa a los marcadores
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;
    const bounds = new window.google.maps.LatLngBounds();
    if (origin) bounds.extend(origin);
    routePackets.forEach((p) => {
      const dest = toLatLng(p.destination);
      if (dest) bounds.extend(dest);
    });
    if (!bounds.isEmpty()) {
      mapRef.current.fitBounds(bounds, 100);
    }
  }, [origin, routePackets, isLoaded]);

  if (!isLoaded || routePackets.length === 0 || !origin) return null;

  return (
    <div style={{ margin: '2rem auto', width: '80%', height: 800 }}>
      <h2>Ruta del repartidor</h2>
      <GoogleMap
        mapContainerStyle={containerStyle}
        onLoad={(map) => {
          mapRef.current = map;
        }}
        center={origin}
        zoom={13}
      >
        <Marker position={origin} label="R" />
        {routePackets.map((p, i) => {
          const dest = toLatLng(p.destination);
          return dest ? (
            <Marker
              key={p._id}
              position={dest}
              label={p._id === selectedPacketId ? 'Tú' : `${i + 1}`}
            />
          ) : null;
        })}
        {directions && (
          <DirectionsRenderer
            options={{
              directions: directions,
              suppressMarkers: true,
              polylineOptions: { strokeColor: '#0000FF', strokeWeight: 4 },
            }}
          />
        )}
      </GoogleMap>
      {eta && (
        <div style={{ marginTop: '1rem' }}>
          <strong>Hora estimada de llegada: </strong>
          {eta}
        </div>
      )}
    </div>
  );
};

export default PackageMap;
