import React, { useEffect, useState } from "react";
import { GoogleMap, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";
import { Packet } from "../../types";

const containerStyle = { width: "100%", height: "400px" };

interface RouteMapProps {
  userLocation: string;
  packets: Packet[];
  onRouteInfo: (distance: string, duration: string) => void;
}

function parseLatLng(location: string) {
  // Si la ubicación es "lat,lng" la convierte a objeto
  const parts = location.split(",");
  if (parts.length === 2) {
    const lat = parseFloat(parts[0]);
    const lng = parseFloat(parts[1]);
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
  }
  return location; // Si no, devuelve la string (dirección)
}

const RouteMap: React.FC<RouteMapProps> = ({ userLocation, packets, onRouteInfo }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  useEffect(() => {
    if (!isLoaded || packets.length === 0) return;

    const origin = parseLatLng(userLocation);
    const destinations = packets.map((p) => parseLatLng(p.destination ?? ""));

    // Especifica el tipo de waypoints para evitar el warning de TypeScript
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
        if (status === "OK" && result) {
          setDirections(result);
          // Extrae distancia y duración total
          const legs = result.routes[0].legs;
          const totalDistance = legs.reduce((acc, l) => acc + (l.distance?.value || 0), 0);
          const totalDuration = legs.reduce((acc, l) => acc + (l.duration?.value || 0), 0);
          onRouteInfo(
            (totalDistance / 1000).toFixed(2) + " km",
            Math.round(totalDuration / 60) + " min"
          );
        } else {
          setDirections(null);
          onRouteInfo("N/A", "N/A");
        }
      }
    );
  }, [isLoaded, packets, userLocation, onRouteInfo]);

  if (!isLoaded) return <div>Cargando mapa...</div>;

  // Centra el mapa en la ubicación del usuario si es posible
  let center = { lat: 41.3874, lng: 2.1686 };
  const parsed = parseLatLng(userLocation);
  if (typeof parsed === "object" && "lat" in parsed && "lng" in parsed) {
    center = parsed;
  }

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  );
};

export default RouteMap;