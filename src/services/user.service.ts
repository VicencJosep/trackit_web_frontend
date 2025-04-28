import axios from 'axios';
import { User } from '../types/index';

// Fetch all users
export const fetchUsers = async (): Promise<User[]> => {
    try {
        const response = await axios.get<User[]>('http://localhost:4000/api/Users');
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

// Fetch user data by token
export const fetchUserData = async (token: string): Promise<User> => {
    try {
        const response = await axios.get<User>('http://localhost:4000/api/Users/me', {
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
        const response = await axios.put<User>(`http://localhost:4000/api/Users/${updatedUser._id}`, updatedUser);

        if (response.status !== 200) {
            throw new Error('Failed to update user');
        }
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};




