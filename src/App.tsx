import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Header from './components/Header';
import Register from './components/Register/Register'; // Asegúrate de que la ruta sea correcta

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            {/* Redirige la raíz (/) al formulario de login */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login onLogin={(credentials) => console.log('User logged in with:', credentials)} />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

