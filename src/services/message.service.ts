import { User, Message } from '../types/index';
import api from '../api/axiosConfig';

export const fetchContacts = async (userId: string): Promise<User[]> => {
    try {
        const response = await api.get<User[]>(`http://localhost:4000/api/Messages/contacts/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};