import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Login from './components/Login';
import Header from './components/Header';
import Register from './components/Register/Register';
import Home from './components/Home/Home';
import LoginCallback from './components/LoginCallback';
import CompleteProfile from './components/CompleteProfile';
import Messages from './components/Messages';
import DigitalAwareness from './components/DigitalAwareness/DigitalAwareness';
import Store from './components/Store/Store';

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
            <Route path="/login/callback" element={<LoginCallback />} /> 
            <Route path='/messages' element={<Messages />} />
            <Route path="/store" element={<Store />} />
            <Route path="/digital-awareness" element={<DigitalAwareness />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />
            
            {/* Puedes agregar más rutas aquí según sea necesario */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
