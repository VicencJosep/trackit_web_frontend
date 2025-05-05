import axios from 'axios';
import { User } from '../types/index';
import api from '../api/axiosConfig';

// Fetch all users
export const fetchUsers = async (): Promise<User[]> => {
    try {
        const response = await api.get<User[]>('http://localhost:4000/api/Users');
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

// Fetch user data by token
export const fetchUserData = async (token: string): Promise<User> => {
    try {
        const response = await api.get<User>('http://localhost:4000/api/Users/me', {
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
        const response = await api.put<User>(`http://localhost:4000/api/Users/${updatedUser._id}`, updatedUser);

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
        const response = await api.get<any[]>(`http://localhost:4000/api/Users/${userId}/packets`);
        if (response.status !== 200) {
            throw new Error('Failed to fetch user packets');
        }
        return response.data; // Devuelve los paquetes del usuario
    } catch (error) {
        console.error('Error fetching user packets:', error);
        throw error;
    }
};
