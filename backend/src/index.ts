import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import sequelize from './config/database';
import authRoutes from './routes/auth';
import vehicleRoutes from './routes/vechile';
import bookingRoutes from './routes/bookings';
import driverRoutes from './routes/drivers';
import adminRoutes from './routes/admin';
import { initSocket } from './sockets';

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});
app.use(cors());
app.use(express.json());

// Make io accessible in routes
app.set('io', io);

// Initialize Socket.IO
initSocket(io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/admin', adminRoutes);

// Sync database
sequelize.sync({ force: false }).then(() => {
  console.log('Database synced');
}).catch((err) => {
  console.error('Database sync error:', err);
});



const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));