import React, { useState } from "react";
import styles from "./CompleteProfile.module.css";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const CompleteProfile = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [birthdate, setBirthdate] = useState("");

    const validatePhone = (phone: string) => {
        const regex = /^[6789]\d{8}$/;
        return regex.test(phone);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validaciones previas
        if (password.length < 6) {
            toast.error("La contraseña debe tener al menos 6 caracteres.", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Las contraseñas no coinciden.", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        if (!validatePhone(phone)) {
            toast.error("El número de teléfono no es válido para España.", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        try {
            const response = await api.put("http://localhost:4000/api/auth/complete-profile", {
                phone,
                password,
                birthdate,
            });

            if (response.data.accessToken && response.data.refreshToken) {
                localStorage.setItem("accessToken", response.data.accessToken);
                localStorage.setItem("refreshToken", response.data.refreshToken);
                toast.success("Perfil completado con éxito.", {
                    position: "top-right",
                    autoClose: 3000,
                });
                navigate("/home", { state: { user: response.data.user } });
            } else {
                toast.error("Tokens de acceso no recibidos.", {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.error("Error al completar el perfil:", error);
            toast.error("Hubo un error al completar el perfil.", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    return (
        <div className={styles.container}>
            <ToastContainer />
            <form onSubmit={handleSubmit}>
                <h1 className={styles.title}>Completa tu perfil</h1>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Contraseña:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={styles.input}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Repetir contraseña:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className={styles.input}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Teléfono:</label>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className={styles.input}
                        maxLength={9}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Fecha de nacimiento:</label>
                    <input
                        type="date"
                        value={birthdate}
                        onChange={(e) => setBirthdate(e.target.value)}
                        required
                        className={styles.input}
                    />
                </div>

                <button type="submit" className={styles.button}>Guardar</button>
            </form>
        </div>
    );
};

export default CompleteProfile;
