import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request if logged in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Events
export const getEvents = () => api.get('/events/');
export const getEventsByCategory = (category) => 
  api.get(`/events/category/${category}/`);

// Venues
export const getVenues = () => api.get('/venues/');
export const getVenuesByCity = (city) => 
  api.get(`/venues/city/${city}/`);

// Shows
export const getShows = () => api.get('/shows/');
export const getShowsByEvent = (eventId) => 
  api.get(`/shows/event/${eventId}/`);
export const getShowsByCity = (city) => 
  api.get(`/shows/city/${city}/`);

// Bookings
export const createBooking = (data) => 
  api.post('/booking/create/', data);
export const getMyBookings = () => 
  api.get('/booking/my/');
export const verifyQR = (bookingId) => 
  api.get(`/booking/verify/${bookingId}/`);
export const lockSeats = (data) => 
  api.post('/booking/lock-seats/', data);

export default api;