import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Header from './components/Header';
import Register from './components/Register/Register';
import { fetchUsers, LogIn, addUser } from './services/user.service';

function App() {
  // Maneja el registro de usuarios
  const handleRegister = async (data: { name: string; email: string; password: string; phone: string }) => {
    try {
      const newUser = await addUser({ ...data, available: true, packets: [] });
      console.log('User registered successfully:', newUser);
      alert('Registration successful! You can now log in.');
    } catch (error) {
      console.error('Error registering user:', error);
      alert('Registration failed. Please try again.');
    }
  };

  // Maneja el inicio de sesión
  const handleLogin = async (email: string, password: string) => {
    try {
      const user = await LogIn(email, password);
      console.log('User logged in:', user);
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login onLogin={({ email, password }) => handleLogin(email, password)} />} />
            <Route path="/register" element={<Register onRegister={handleRegister} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

