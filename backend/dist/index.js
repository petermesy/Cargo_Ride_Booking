"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
const auth_1 = __importDefault(require("./routes/auth"));
const vechile_1 = __importDefault(require("./routes/vechile"));
const bookings_1 = __importDefault(require("./routes/bookings"));
const drivers_1 = __importDefault(require("./routes/drivers"));
const admin_1 = __importDefault(require("./routes/admin"));
const sockets_1 = require("./sockets");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Make io accessible in routes
app.set('io', io);
// Initialize Socket.IO
(0, sockets_1.initSocket)(io);
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/vehicles', vechile_1.default);
app.use('/api/bookings', bookings_1.default);
app.use('/api/drivers', drivers_1.default);
app.use('/api/admin', admin_1.default);
// Sync database
database_1.default.sync({ force: false }).then(() => {
    console.log('Database synced');
}).catch((err) => {
    console.error('Database sync error:', err);
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
