import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Header from './components/Header';
import Register from './components/Register/Register';
import Dashboard from './components/Dashboard/Dashboard';
import { LogIn } from './services/auth.service';
import Home from './components/Home/Home';

function App() {
 

  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Home />} />            
            {/* Puedes agregar más rutas aquí según sea necesario */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
