import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Header from './components/Header';
import Register from './components/Register/Register';
import Home from './components/Home/Home';
import LoginCallback from './components/LoginCallback';
import CompleteProfile from './components/CompleteProfile';
import DigitalAwareness from './components/DigitalAwareness/DigitalAwareness';
import Store from './components/Store/Store';
import Chat from './components/Chat/Chat';
import React, { useEffect, useState } from 'react';
import HomeDelivery from './components/HomeDelivery';
import { socket } from './socket';
import DeliveryHome from './components/DeliveryHome/DeliveryHome';

function App() {
const [isConnected, setIsConnected] = useState(socket.connected);
  
   // Gestion de la conexión del socket
   useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
   }, []);
  return (
    <Router>
      <div className="App">
        <Header disconnect={() => socket.connect()}/>
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login connect={() => socket.connect()} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Home />} />      
            <Route path="/login/callback" element={<LoginCallback />} /> 
            <Route path="/messages" element={<Chat />} />
            <Route path="/homeDelivery" element={<HomeDelivery />} />
            <Route path="/store" element={<Store />} />
              <Route
              path="/digital-awareness"
              element={<DigitalAwareness />}
            />
            <Route path="/complete-profile" element={<CompleteProfile />} />
            
            
            {/* Puedes agregar más rutas aquí según sea necesario */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
