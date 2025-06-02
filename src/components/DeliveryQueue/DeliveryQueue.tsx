import React, { useEffect, useState } from 'react';
import { getAssignedPackets, updateDeliveryQueue, fetchUserData } from '../../services/user.service';
import { Packet } from '../../types/index';

const DeliveryQueue: React.FC = () => {
    const [queue, setQueue] = useState<Packet[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [userID, setUserID] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserAndQueue = async () => {
            try {
                // Fetch the current user's data
                const userData = await fetchUserData(localStorage.getItem('accessToken') || '');
                setUserID(userData.id);

                // Fetch the delivery queue for the user
                const data = await getAssignedPackets(userData.id);
                setQueue(data); // Ahora `data` es un arreglo de objetos Packet
            } catch (error) {
                console.error('Error fetching user or delivery queue:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserAndQueue();
    }, []);

    const handleReorder = (startIndex: number, endIndex: number) => {
        const updatedQueue = [...queue];
        const [removed] = updatedQueue.splice(startIndex, 1);
        updatedQueue.splice(endIndex, 0, removed);
        setQueue(updatedQueue);
    };

    const handleSave = async () => {
        if (!userID) {
            alert('User not found.');
            return;
        }

        try {
            // Extrae los IDs de los paquetes para enviarlos al backend
            const queueIds = queue.map((packet) => packet._id || '');
            await updateDeliveryQueue(userID, queueIds);
            alert('Delivery queue updated successfully!');
        } catch (error) {
            console.error('Error updating delivery queue:', error);
            alert('Failed to update delivery queue.');
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Delivery Queue</h1>
            <ul>
                {queue.map((packet, index) => (
                    <li key={packet._id || index}>
                        <div>
                            <strong>Name:</strong> {packet.name} <br />
                            <strong>Description:</strong> {packet.description} <br />
                            <strong>Status:</strong> {packet.status} <br />
                            <strong>Created At:</strong> {new Date(packet.createdAt).toLocaleString()} <br />
                            {packet.deliveredAt && (
                                <>
                                    <strong>Delivered At:</strong> {new Date(packet.deliveredAt).toLocaleString()} <br />
                                </>
                            )}
                            <strong>Size:</strong> {packet.size} <br />
                            <strong>Weight:</strong> {packet.weight} <br />
                            {packet.origin && <><strong>Origin:</strong> {packet.origin} <br /></>}
                            {packet.destination && <><strong>Destination:</strong> {packet.destination} <br /></>}
                            {packet.location && <><strong>Location:</strong> {packet.location} <br /></>}
                        </div>
                        <button onClick={() => handleReorder(index, index - 1)} disabled={index === 0}>
                            ↑
                        </button>
                        <button onClick={() => handleReorder(index, index + 1)} disabled={index === queue.length - 1}>
                            ↓
                        </button>
                    </li>
                ))}
            </ul>
            <button onClick={handleSave}>Save Changes</button>
        </div>
    );
};

export default DeliveryQueue;