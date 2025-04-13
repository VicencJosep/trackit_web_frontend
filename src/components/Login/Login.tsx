import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- Importa useNavigate
import styles from './Login.module.css';

interface FormProps {
    onLogin: (credentials: { email: string; password: string }) => void;
}

const Login: React.FC<FormProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // <-- Hook para redirección

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!email || !password) {
            alert('Please fill in both email and password.');
            return;
        }
        onLogin({ email, password });
    };

    const handleGoToRegister = () => {
        navigate('/register'); // <-- Cambia según tu ruta para Register
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
