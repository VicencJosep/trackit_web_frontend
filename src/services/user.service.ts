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

/*
export const addUser = async (newUser: User): Promise<User> => {
    try {
        const response = await axios.post<User>('http://localhost:4000/api/Users', newUser);
        if (response.status !== 200 && response.status !== 201) {
            throw new Error('Failed to add user');
        }
        return response.data;
    } catch (error) {
        console.error('Error adding user:', error);
        throw error; 
    }Ñ
};
*/

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




