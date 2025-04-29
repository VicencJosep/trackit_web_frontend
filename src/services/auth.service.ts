import axios from 'axios';
import { User } from '../types/index';
// Log in a user
export const LogIn = async (email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> => {
    try {
        const response = await axios.post('http://localhost:4000/api/auth/login', { email, password });

        if (response.status !== 200) {
            throw new Error('Failed to log in');
        }

        // Devuelve los tokens
        return {
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
        };
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};
// Register a new user
export const registerUser = async (data: { name: string; email: string; password: string; phone: string }): Promise<User> => {
    try {
        const response = await axios.post<User>('http://localhost:4000/api/auth/register', data);
        if (response.status !== 200 && response.status !== 201) {
            throw new Error('Failed to register user');
        }
        return response.data;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};