import React, { useEffect, useState, useRef } from 'react';
import { GoogleMap, Marker, DirectionsService, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';
import { Packet } from '../../types';
import { GetUserPackets } from '../../services/user.service';

interface PackageMapProps {
    userId: string;
    selectedPacketId: string | null;
}

const containerStyle = { width: '100%', height: '800px' };

const PackageMap: React.FC<PackageMapProps> = ({ userId, selectedPacketId }) => {
    const [packet, setPacket] = useState<Packet | null>(null);
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
    const [eta, setEta] = useState<string | null>(null);

    const mapRef = useRef<google.maps.Map | null>(null);

    useEffect(() => {
        if (!selectedPacketId) {
            setPacket(null);
            setDirections(null);
            setEta(null);
            return;
        }
        const fetchPacket = async () => {
            const packets = await GetUserPackets(userId);
            const found = packets.find((p: Packet) => p._id === selectedPacketId);
            setPacket(found || null);
            setDirections(null);
            setEta(null);
        };
        fetchPacket();
    }, [userId, selectedPacketId]);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyArB7sm8JJfG-AntpJpzaRSTmyJ1PF6b0Q', // <-- PON AQUÍ TU API KEY DE GOOGLE MAPS
         libraries: ['places'],
    });

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

    const origin = toLatLng(packet?.origin);
    const destination = toLatLng(packet?.destination);
    const current = toLatLng(packet?.location);

    // Ajustar el mapa a los marcadores
    useEffect(() => {
        if (!isLoaded || !mapRef.current) return;
        const bounds = new window.google.maps.LatLngBounds();
        if (origin) bounds.extend(origin);
        if (destination) bounds.extend(destination);
        if (current) bounds.extend(current);
        if (!bounds.isEmpty()) {
            mapRef.current.fitBounds(bounds, 100);
        }
    }, [origin, destination, current, isLoaded]);

    const center = current || origin || destination || { lat: 40.4168, lng: -3.7038 };
    const shouldRequestDirections = current && destination && !directions;

    if (!isLoaded || !packet) return null;

    return (
        <div style={{ margin: '2rem auto', width: '80%', height: 800 }}>
            <h2>Seguimiento de: {packet.name}</h2>
            <GoogleMap
                mapContainerStyle={containerStyle}
                onLoad={map => { mapRef.current = map; }}
                center={center}
                zoom={13}
            >
                {origin && <Marker position={origin} label="O" />}
                {destination && <Marker position={destination} label="D" />}
                {current && <Marker position={current} label="A" />}
                {shouldRequestDirections && (
                    <DirectionsService
                        options={{
                            origin: current,
                            destination: destination,
                            travelMode: google.maps.TravelMode.DRIVING,
                        }}
                        callback={result => {
                            const res = result as google.maps.DirectionsResult & { status?: string };
                            if (res && res.status === 'OK') {
                                setDirections(res);
                                const leg = res.routes[0]?.legs[0];
                                if (leg && leg.duration) {
                                    const etaDate = new Date(Date.now() + leg.duration.value * 1000);
                                    setEta(etaDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                                }
                            }
                        }}
                    />
                )}
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