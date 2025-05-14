import { User, Message } from '../types/index';
import api from '../api/axiosConfig';



export const fetchContacts = async (userId: string): Promise<User[]> => {
    try {
        const response = await api.get<User[]>(`${process.env.URL_BACKEND}/Messages/contacts/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};

export const fetchMessages = async (user1Id: string, user2Id: string): Promise<Message[]> => {
    try {
        const response = await api.get<Message[]>(`${process.env.URL_BACKEND}/Messages/${user1Id}/${user2Id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};
// Update an existing user
export const acknowledgeMessage = async (messageId: string): Promise<Message> => {
    try {
        const response = await api.put<Message>(`${process.env.URL_BACKEND}/Messages/${messageId}`, { messageId });

        if (response.status !== 200) {
            throw new Error('Failed to update user');
        }
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};
