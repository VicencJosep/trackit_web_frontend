import React, { useEffect, useState } from 'react';
import styles from './AdminTablesModal.module.css';
import { User, Packet } from '../../types';
import { fetchUsers, GetUserPackets } from '../../services/user.service';

interface AdminTablesModalProps {
    onClose: () => void;
}

type PacketWithUser = Packet & { userName?: string };

const AdminTablesModal: React.FC<AdminTablesModalProps> = ({ onClose }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [packets, setPackets] = useState<PacketWithUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const usersData = await fetchUsers();
                const usersArray = Array.isArray((usersData as any).data) ? (usersData as any).data : [];
                setUsers(usersArray);

                const allPackets: PacketWithUser[] = [];
                for (const user of usersArray) {
                    try {
                        const userPackets = await GetUserPackets(user.id || '');
                        const packetsWithUser = userPackets.map((p: Packet) => ({
                            ...p,
                            userName: user.name,
                        }));
                        allPackets.push(...packetsWithUser);
                    } catch (e) {}
                }
                setPackets(allPackets);
            } catch (error) {
                console.error('Error en fetchData:', error);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    const normalUsers = users.filter(u => u.role === 'user');
    const deliveryUsers = users.filter(u => u.role === 'delivery');
    const almacenPackets = packets.filter(p => p.status === 'almacén');
    const repartoPackets = packets.filter(p => p.status === 'en reparto');

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent} style={{ display: 'flex', gap: '2rem' }}>
                <button className={styles.closeButton} onClick={onClose}>Cerrar</button>
                {loading ? (
                    <div>Cargando...</div>
                ) : (
                    <>
                        {/* Mini tabla resumen a la izquierda */}
                        <div style={{ minWidth: 180 }}>
                            <h3>Resumen</h3>
                            <table className={styles.summaryTable}>
                                <tbody>
                                    <tr>
                                        <td><strong>Usuarios</strong></td>
                                        <td style={{ textAlign: 'right' }}>{normalUsers.length}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Repartidores</strong></td>
                                        <td style={{ textAlign: 'right' }}>{deliveryUsers.length}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Paquetes totales</strong></td>
                                        <td style={{ textAlign: 'right' }}>{packets.length}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Paquetes en almacén</strong></td>
                                        <td style={{ textAlign: 'right' }}>{almacenPackets.length}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Paquetes en reparto</strong></td>
                                        <td style={{ textAlign: 'right' }}>{repartoPackets.length}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        {/* Tablas completas a la derecha */}
                        <div style={{ flex: 1, overflowX: 'auto' }}>
                            <h2>Usuarios creados</h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Email</th>
                                        <th>Teléfono</th>
                                        <th>Disponible</th>
                                        <th>Fecha de nacimiento</th>
                                        <th>Perfil completo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {normalUsers.map(u => (
                                        <tr key={u.id}>
                                            <td>{u.name}</td>
                                            <td>{u.email}</td>
                                            <td>{u.phone}</td>
                                            <td>{u.available ? 'Sí' : 'No'}</td>
                                            <td>{new Date(u.birthdate).toLocaleDateString()}</td>
                                            <td>{u.isProfileComplete ? 'Sí' : 'No'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <h2>Repartidores disponibles</h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Email</th>
                                        <th>Teléfono</th>
                                        <th>Disponible</th>
                                        <th>Fecha de nacimiento</th>
                                        <th>Perfil completo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {deliveryUsers.map(u => (
                                        <tr key={u.id}>
                                            <td>{u.name}</td>
                                            <td>{u.email}</td>
                                            <td>{u.phone}</td>
                                            <td>{u.available ? 'Sí' : 'No'}</td>
                                            <td>{new Date(u.birthdate).toLocaleDateString()}</td>
                                            <td>{u.isProfileComplete ? 'Sí' : 'No'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <h2>Paquetes en almacén</h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Usuario</th>
                                        <th>Nombre</th>
                                        <th>Descripción</th>
                                        <th>Estado</th>
                                        <th>Fecha creación</th>
                                        <th>Tamaño</th>
                                        <th>Peso</th>
                                        <th>Origen</th>
                                        <th>Destino</th>
                                        <th>Ubicación</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {almacenPackets.map((p, idx) => (
                                        <tr key={p._id || idx}>
                                            <td>{p.userName || ''}</td>
                                            <td>{p.name}</td>
                                            <td>{p.description}</td>
                                            <td>{p.status}</td>
                                            <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                                            <td>{p.size}</td>
                                            <td>{p.weight}</td>
                                            <td>{p.origin}</td>
                                            <td>{p.destination}</td>
                                            <td>{p.location}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <h2>Paquetes en reparto</h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Usuario</th>
                                        <th>Nombre</th>
                                        <th>Descripción</th>
                                        <th>Estado</th>
                                        <th>Fecha creación</th>
                                        <th>Tamaño</th>
                                        <th>Peso</th>
                                        <th>Origen</th>
                                        <th>Destino</th>
                                        <th>Ubicación</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {repartoPackets.map((p, idx) => (
                                        <tr key={p._id || idx}>
                                            <td>{p.userName || ''}</td>
                                            <td>{p.name}</td>
                                            <td>{p.description}</td>
                                            <td>{p.status}</td>
                                            <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                                            <td>{p.size}</td>
                                            <td>{p.weight}</td>
                                            <td>{p.origin}</td>
                                            <td>{p.destination}</td>
                                            <td>{p.location}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminTablesModal;