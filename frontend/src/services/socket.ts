import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

socket.on('connect', () => console.log('Socket.IO connected'));
socket.on('connect_error', (err: any) => console.error('Socket.IO error:', err));

export default socket;