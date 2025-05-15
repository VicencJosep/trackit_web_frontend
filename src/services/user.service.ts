import { User } from '../types/index';
import api from '../api/axiosConfig';
import { Packet } from '../types/index';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Fetch all users
export const fetchUsers = async (): Promise<User[]> => {
    try {
        const response = await api.get<User[]>(`${API_BASE_URL}/Users`);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

// Fetch user data by token
export const fetchUserData = async (token: string): Promise<User> => {
    try {
        const response = await api.get<User>(`${API_BASE_URL}/Users/me`, {
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
export const updateUser = async (updatedUser: User): Promise<User> => {
    try {
        const response = await api.put<User>(`${API_BASE_URL}/Users/${updatedUser._id}`, updatedUser);

        if (response.status !== 200) {
            throw new Error('Failed to update user');
        }
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

export const GetUserPackets = async (userId: string): Promise<any[]> => {
    try {
        const response = await api.get<any[]>(`${API_BASE_URL}/Users/${userId}/packets`);
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
        const response = await api.post(`${API_BASE_URL}/users/${encodeURIComponent(userName)}/packets`, {
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
        const response = await api.post<Packet>(`${API_BASE_URL}/packets`, packet);

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