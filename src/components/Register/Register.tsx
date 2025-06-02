import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';
import { registerUser } from '../../services/auth.service';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        birthdate: '',
    });

    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setErrorMessage(''); // limpiar errores al escribir
    };

    const validatePhone = (phone: string) => {
        const phoneRegex = /^[679]\d{8}$/; // España: 9 dígitos, empieza por 6, 7 o 9
        return phoneRegex.test(phone);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { name, email, password, confirmPassword, phone, birthdate } = formData;

        if (!name || !email || !password || !confirmPassword || !phone || !birthdate) {
            setErrorMessage('Por favor, rellena todos los campos.');
            return;
        }

        // Validación de fecha de nacimiento
        const birthYear = Number(birthdate.split('-')[0]);
        if (birthYear < 1900 || birthYear > 2024) {
            setErrorMessage('La fecha de nacimiento debe estar entre 1900 y 2024.');
            return;
        }

        if (password.length < 6) {
            setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage('Las contraseñas no coinciden.');
            return;
        }

        if (!validatePhone(phone)) {
            setErrorMessage('El número de teléfono debe tener 9 dígitos y comenzar por 6, 7 o 9.');
            return;
        }

        try {
            await registerUser(formData);
            console.log('Mostrando toast de éxito');
            toast.success('¡Registro exitoso! Ahora puedes iniciar sesión.', {
                position: "top-right",
                autoClose: 3000,
            });
            setTimeout(() => {
                navigate('/login');
            }, 3000); // esperar lo mismo que autoClose
        } catch (error) {
            console.error('Error registering user:', error);
            setErrorMessage('Fallo al registrar. Intenta nuevamente.');
        }
    };

    return (
        <div className={styles.registerContainer}>
            <ToastContainer />
            <h1 className={styles.registerTitle}>Registrarse</h1>
            <form onSubmit={handleSubmit} className={styles.registerForm}>
                {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

                <div className={styles.formGroup}>
                    <label htmlFor="name">Nombre:</label>
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
                    <label htmlFor="password">Contraseña:</label>
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
                    <label htmlFor="confirmPassword">Repetir contraseña:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="phone">Teléfono:</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        pattern="[679][0-9]{8}"
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="birthdate">Fecha de nacimiento:</label>
                    <input
                        type="date"
                        id="birthdate"
                        name="birthdate"
                        value={formData.birthdate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className={styles.submitButton}>
                    Registrarse
                </button>
            </form>
        </div>
    );
};

export default Register;
