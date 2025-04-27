import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { LogIn } from '../../services/auth.service'; // Importa el servicio de login

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!email || !password) {
            alert('Please fill in both email and password.');
            return;
        }

        try {
            // Llama al servicio de login
            const { accessToken, refreshToken } = await LogIn(email, password);

            // Almacena los tokens en localStorage
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            alert('Login successful!');
            navigate('/dashboard'); // Redirige al Dashboard
        } catch (error) {
            console.error('Login failed:', error);
            alert('Invalid credentials. Please try again.');
        }
    };

    const handleGoToRegister = () => {
        navigate('/register');
    };

    return (
        <div className={styles.loginContainer}>
            <h1>Login</h1>
            <form onSubmit={handleSubmit} className={styles.loginForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className={styles.submitButton}>
                    Login
                </button>
            </form>
            <p className={styles.registerText}>
                Don’t you have an account?{' '}
                <span className={styles.registerLink} onClick={handleGoToRegister}>
                    Create one!
                </span>
            </p>
        </div>
    );
};

export default Login;
