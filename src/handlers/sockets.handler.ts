
import { Server } from 'socket.io';
import SocketController from '../controllers/socket.controller';

const socketHandler = (io: Server) => {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);
        new SocketController(socket);
    });
};

export default socketHandler;
