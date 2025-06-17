import { User, Message } from '../types/index';
import api from '../api/axiosConfig';

export const fetchContacts = async (userId: string): Promise<User[]> => {
  try {
    const response = await api.get<User[]>(`/messages/contacts/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

export const fetchMessages = async (user1Id: string, user2Id: string): Promise<Message[]> => {
  try {
    const response = await api.get<Message[]>(`/Messages/${user1Id}/${user2Id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};
// Update an existing user
export const acknowledgeMessage = async (messageId: string): Promise<Message> => {
  try {
    const response = await api.put<Message>(`/Messages/${messageId}`, { messageId });

    if (response.status !== 200) {
      throw new Error('Failed to update user');
    }
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};
export const startConversation = async (user1Id: string, user2Id: string): Promise<Message> => {
  try {
    const response = await api.post<Message>('/messages/start', { user1Id, user2Id });
    if (response.status !== 201) {
      throw new Error('Error starting conversation');
    }
    return response.data;
  } catch (error) {
    console.error('Error starting conversation:', error);
    throw error;
  }
};
