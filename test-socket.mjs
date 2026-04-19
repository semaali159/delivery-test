import { io } from 'socket.io-client';

const captainId = '69e4d736e4c51c011771e5c2';
const url = `http://localhost:3003/locations?captainId=${captainId}`;

const socket = io(url, {
  transports: ['websocket'],
});

socket.on('connect', () => {
  console.log('connected', socket.id);
  socket.emit('update_location', { lat: 33.5138, lng: 36.2765 });
});

socket.on('location_changed', (payload) => {
  console.log('location_changed', payload);
});

socket.on('captain_disconnected', (payload) => {
  console.log('captain_disconnected', payload);
});

socket.on('connect_error', (err) => {
  console.error('connect_error', err.message);
});

socket.on('disconnect', (reason) => {
  console.log('disconnect', reason);
});