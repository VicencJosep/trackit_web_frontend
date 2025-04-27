import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';
import { User } from '../../types'; // Asegúrate de tener la interfaz User definida en tu proyecto

interface FormProps {
    onRegister: (data: { name: string; email: string; password: string; phone: string }) => void;
}

const Register: React.FC<FormProps> = ({ onRegister }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
    });

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const { name, email, password, phone } = formData;
        if (!name || !email || !password || !phone) {
            alert('Please fill in all fields.');
            return;
        }

        onRegister(formData); // Maneja el registro del usuario
        console.log('Registering user:', formData);

        // Redirige al usuario al formulario de Home y pasa el usuario como parámetro
        navigate('/home', { state: { user: formData } });
    };

    return (
        <div className={styles.registerContainer}>
            <h1 className={styles.registerTitle}>Register</h1>
            <form onSubmit={handleSubmit} className={styles.registerForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="phone">Phone:</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className={styles.submitButton}>
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;
