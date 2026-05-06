import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import Home from './pages/Home';
import MovieList from './pages/MovieList';
import SeatSelection from './pages/SeatSelection';
import Payment from './pages/Payment';
import Ticket from './pages/Ticket';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Router>
      <div className="App">
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/events" element={<MovieList />} />
          <Route path="/seats/:showId" element={<SeatSelection />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/ticket/:bookingId" element={<Ticket />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;