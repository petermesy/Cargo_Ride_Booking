import { Server } from 'socket.io';

export const initSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('updateVehicleStatus', (data) => {
      io.emit('vehicleStatusUpdate', data);
    });

    socket.on('updateLocation', (data) => {
      io.emit('vehicleLocationUpdate', data);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};