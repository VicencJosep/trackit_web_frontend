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

export const fetchMessages = async (user1Id: string, user2Id: string): Promise<Message[]> => {
    try {
        const response = await api.get<Message[]>(`http://localhost:4000/api/Messages/${user1Id}/${user2Id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};
