import { User } from '../types/index';
import api from '../api/axiosConfig';
import { Packet } from '../types/index';

// Fetch all users
export const fetchUsers = async (): Promise<User[]> => {
    try {
        const response = await api.get<User[]>('/Users');
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};
export const getAllPackets = async (): Promise<Packet[]> => {
  try {
    const token = localStorage.getItem('accessToken');

    const response = await fetch('http://localhost:4000/api/packets', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Error al obtener los paquetes');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching packets:', error);
    throw error;
  }
};

// Fetch user data by token
export const fetchUserData = async (token: string): Promise<User> => {
    try {
        const response = await api.get<User>('/Users/me', {
            headers: {
                Authorization: `Bearer ${token}`, // Enviamos el token en el encabezado
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};

// Update an existing user

export const GetUserPackets = async (userId: string): Promise<any[]> => {
    try {
        const response = await api.get<any[]>(`/Users/${userId}/packets`);
        if (response.status !== 200) {
            throw new Error('Failed to fetch user packets');
        }
        return response.data; // Devuelve los paquetes del usuario
    } catch (error) {
        console.error('Error fetching user packets:', error);
        throw error;
    }
};

export const buyPacket = async (userName: string, packetId: string): Promise<void> => {
    try {
        const response = await api.post(`/users/${encodeURIComponent(userName)}/packets`, {
            packetId,
        });

        if (response.status !== 200 && response.status !== 201) {
            throw new Error('Failed to associate packet with user');
        }

        console.log(`Paquete con ID ${packetId} asociado al usuario con nombre ${userName}`);
    } catch (error) {
        console.error('Error al asociar el paquete al usuario:', error);
        throw error;
    }
};

export const createPacket = async (packet: Packet): Promise<Packet> => {
    try {
        const response = await api.post<Packet>('/packets', packet);

        // Verifica si la respuesta tiene un estado exitoso
        if (response.status < 200 || response.status >= 300) {
            throw new Error('Failed to create packet');
        }

        // Devuelve los datos del paquete creado
        return response.data;
    } catch (error) {
        console.error('Error creating packet:', error);

        // Lanza el error para que pueda ser manejado por el código que llama a esta función
        throw error;
    }
};
export const updateUser = async (userId: string, data: any) => {
  const token = localStorage.getItem("accessToken");
  const response = await api.put(`/users/${userId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteUser = async (userId: string) => {
  return await api.put(`/users/${userId}/deactivate`);
};


export const getAssignedPackets = async (userId: string): Promise<Packet[]> => {
  try {
    const response = await api.get<Packet[]>(`/users/${userId}/assignedPackets`);
    if (response.status !== 200) {
      throw new Error('Failed to fetch assigned packets');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching assigned packets:', error);
    throw error;
  }
};
export const assignPacketToDelivery = async (userId: string, packetId: string): Promise<void> => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await api.post(`/users/${userId}/assignedPackets`, 
      { packetId }, 
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.status !== 200) {
      throw new Error('Error al asignar paquete al repartidor');
    }
  } catch (error) {
    console.error('Error en assignPacketToDelivery:', error);
    throw error;
  }
};

