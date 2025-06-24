"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = void 0;
const initSocket = (io) => {
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
exports.initSocket = initSocket;
