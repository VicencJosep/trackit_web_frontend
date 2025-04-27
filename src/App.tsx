import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Header from './components/Header';
import Register from './components/Register/Register';
import Home from './components/Home/Home';
import { fetchUsers, LogIn, addUser } from './services/user.service';
import { User } from './types/index'; // Importa el tipo User correctamente

// Define tipos para mayor claridad
interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <AppRoutes />
        </main>
      </div>
    </Router>
  );
}

function AppRoutes() {
  const navigate = useNavigate(); // <-- Ahora usamos useNavigate aquí

  const handleRegister = async (data: RegisterData) => {
    try {
      const newUser: User = await addUser({
        ...data,
        available: true,
        packets: [],
      });
      console.log('User registered successfully:', newUser);
      alert('Registration successful!');
      // Navegar a /home con el usuario completo que devuelve la API
      navigate('/home', { state: { user: newUser } });
    } catch (error) {
      console.error('Error registering user:', error);
      alert('Registration failed. Please try again.');
    }
  };

  const handleLogin = async (credentials: LoginCredentials) => {
    const { email, password } = credentials;
    try {
      const user: User = await LogIn(email, password);
      console.log('User logged in:', user);
      navigate('/home', { state: { user } }); // También llevamos al usuario después de login
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/register" element={<Register onRegister={handleRegister} />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

export default App;
