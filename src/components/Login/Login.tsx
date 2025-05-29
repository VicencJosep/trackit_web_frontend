
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { LogIn } from '../../services/auth.service'; // Asumiendo que tienes un servicio para el login
import { fetchUserData } from '../../services/user.service'; // Servicio para obtener los datos del usuario

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    
    function parseJwt(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );

        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
    }

    const handleSubmit = async () => {
    try {
        const { accessToken, refreshToken } = await LogIn(email, password);
        const data = await fetchUserData(accessToken);

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        const role = parseJwt(accessToken)?.role;

        if (data.isProfileComplete === false) {
            navigate('/complete-profile', { state: { user: data } });
        } else {
            if (role === 'delivery') {
                navigate('/homeDelivery', { state: { user: data } });
            } else {
                navigate('/home', { state: { user: data } });
            }
        }
    } catch (error: any) {
        console.error('Login failed:', error);
        setErrorMessage(error?.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
        setIsSubmitting(false);
    }
};

    const handleGoogleLogin = () => {
        // Redirigir a Google para el login OAuth
        window.location.href = `${process.env.REACT_APP_BACKEND_URL}/api/auth/google`;
    };

    return (
        <div className={styles.body}>
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
                {errorMessage && (
                    <p className={styles.errorMessage} aria-live="polite">
                        {errorMessage}
                    </p>
                )}
                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Logging in...' : 'Login'}
                </button>
            </form>
            <div className={styles.googleLogin}>
                <button
                    onClick={handleGoogleLogin}
                    className={styles.googleButton}
                    disabled={isSubmitting}
                >
                    <img
                        src="https://rotulosmatesanz.com/wp-content/uploads/2017/09/2000px-Google_G_Logo.svg_.png"
                        alt="Google logo"
                        className={styles.googleIcon}
                    />
                    {isSubmitting ? 'Signing in with Google...' : 'Sign in with Google'}
                </button>
            </div>
            <p className={styles.registerText}>
                Don't you have an account?{' '}
                <span className={styles.registerLink} onClick={() => navigate('/register')}>
                    Create one!
                </span>
            </p>
        </div>
        </div>
    );
};

export default Login;
